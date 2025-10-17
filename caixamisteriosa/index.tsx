/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Type } from '@google/genai';

// --- TYPES ---

interface User {
  id: string;
  name: string;
  phone: string;
  neighborhood: string;
  city: string;
}

interface Product {
  id: string;
  name: string;
  clues: string[];
}

interface Sponsor {
  id: string;
  name: string;
  products: Product[];
}

interface Submission {
    user: User;
    guess: string;
}

interface LiveGame {
    status: 'pending' | 'accepting' | 'closed' | 'finished';
    giveaway: {
        sponsorName: string;
        productName: string;
        clues: string[];
    } | null;
    revealedCluesCount: number;
    submissions: Submission[];
    winner: Submission | null;
}

// --- STATE MANAGEMENT ---

let state = {
  loading: false,
  screen: 'welcome', // 'welcome', 'participant', 'participantWaiting', 'adminLogin', 'adminSetup', 'operatorDashboard', 'operatorResults'
  lastFinishedGame: null, // Dados do último jogo finalizado
  user: null as User | null, // The logged-in user (can be admin)
  participantDetails: null as User | null, // The saved details for a participant
  hasSubmitted: false, // Local flag for the current participant
  sponsors: [] as Sponsor[],
  admin: { // State for the admin setup UI
    view: 'listSponsors',
    currentSponsorId: null as string | null,
    currentProductId: null as string | null,
  },
  // This state is synced across all clients via localStorage
  liveGame: {
    status: 'pending',
    giveaway: null,
    revealedCluesCount: 0,
    submissions: [],
    winner: null,
  } as LiveGame,
  drawingWinner: false, // For roulette animation
  rouletteData: null as { items: Submission[], finalTransformY: number } | null, // For roulette animation
  modal: null as { title: string, message: string, onConfirm: () => void } | null, // For custom confirmation modal
};

const appElement = document.getElementById('app');
const modalContainerElement = document.getElementById('modal-container');


// --- LIVE GAME STATE SYNC (LocalStorage) ---

function saveLiveGameState(gameData: LiveGame) {
  localStorage.setItem('mysteryBoxLiveGame', JSON.stringify(gameData));
}

function loadLiveGameState(): LiveGame | null {
  const data = localStorage.getItem('mysteryBoxLiveGame');
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Error parsing liveGame state from localStorage:", e);
    localStorage.removeItem('mysteryBoxLiveGame'); // Clear corrupted data
    return null;
  }
}

function clearLiveGameState() {
    localStorage.removeItem('mysteryBoxLiveGame');
}

// Global state updater - triggers 'storage' event for other tabs/browsers
function setLiveGameState(updates: Partial<LiveGame>) {
    const newLiveGameState = { ...state.liveGame, ...updates };

    const stateUpdate: Partial<typeof state> = { liveGame: newLiveGameState };

    // If this update affects the admin's screen, calculate the new screen and add it to the update.
    if (state.user?.id === 'admin') {
        let targetScreen = 'adminSetup'; // Default for pending
        if (newLiveGameState.status === 'accepting' || newLiveGameState.status === 'closed') {
            targetScreen = 'operatorDashboard';
        } else if (newLiveGameState.status === 'finished') {
            targetScreen = 'operatorResults';
        }

        if (state.screen !== targetScreen && (state.screen.startsWith('admin') || state.screen.startsWith('operator'))) {
             stateUpdate.screen = targetScreen;
        }
    }

    // Update our own state first
    setState(stateUpdate);

    // Save to localStorage to notify others
    saveLiveGameState(newLiveGameState);
}

// Listen for changes from other tabs/clients
window.addEventListener('storage', (event) => {
    if (event.key === 'mysteryBoxLiveGame' && event.newValue) {
        const updatedLiveGame = JSON.parse(event.newValue);
        // Check to prevent infinite loops if we were the ones who made the change
        if (JSON.stringify(state.liveGame) !== JSON.stringify(updatedLiveGame)) {
            setState({ liveGame: updatedLiveGame });
        }
    } else if (event.key === 'mysteryBoxLiveGame' && !event.newValue) {
        // Game was reset by admin
        setState({ screen: 'welcome', liveGame: getInitialLiveGameState() });
    }
});


// --- INITIALIZATION ---

function getInitialLiveGameState(): LiveGame {
    return {
        status: 'pending',
        giveaway: null,
        revealedCluesCount: 0,
        submissions: [],
        winner: null,
    };
}

function loadInitialState() {
  let loadedSponsors: Sponsor[] = [];
  try {
      const sponsorsStr = localStorage.getItem('mysteryBoxSponsors');
      if (sponsorsStr) {
        loadedSponsors = JSON.parse(sponsorsStr);
      }
  } catch (e) {
      console.error("Error parsing sponsors from localStorage, clearing data.", e);
      localStorage.removeItem('mysteryBoxSponsors');
  }

  let loadedUser: User | null = null;
  try {
      const userStr = localStorage.getItem('mysteryBoxAdminUser');
      if (userStr) {
        loadedUser = JSON.parse(userStr);
      }
  } catch (e) {
      console.error("Error parsing admin user from localStorage, clearing data.", e);
      localStorage.removeItem('mysteryBoxAdminUser');
  }

  let loadedParticipant: User | null = null;
  try {
      const participantStr = localStorage.getItem('mysteryBoxParticipantUser');
      if (participantStr) {
        loadedParticipant = JSON.parse(participantStr);
      }
  } catch (e) {
      console.error("Error parsing participant user from localStorage, clearing data.", e);
      localStorage.removeItem('mysteryBoxParticipantUser');
  }

  const liveGame = loadLiveGameState();
  const hasSubmitted = localStorage.getItem(`submitted_${liveGame?.giveaway?.productName || ''}`) === 'true';

  let initialScreen = 'welcome';
  if (loadedUser?.id === 'admin') {
      if (!liveGame || liveGame.status === 'pending') {
          initialScreen = 'adminSetup';
      } else if (liveGame.status === 'accepting' || liveGame.status === 'closed') {
          initialScreen = 'operatorDashboard';
      } else if (liveGame.status === 'finished') {
          initialScreen = 'operatorResults';
      }
  } else if (liveGame && liveGame.status !== 'pending') {
      initialScreen = 'participant';
  }

  setState({
    sponsors: loadedSponsors,
    user: loadedUser,
    participantDetails: loadedParticipant,
    hasSubmitted,
    liveGame: liveGame || getInitialLiveGameState(),
    screen: initialScreen,
  });
  fetchLastFinishedGame();
}

function saveSponsorsToLocalStorage() {
  localStorage.setItem('mysteryBoxSponsors', JSON.stringify(state.sponsors));
}

// --- API INTERACTION (Re-used from previous version) ---
async function generateCluesWithAI(productName: string): Promise<string[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Gere 5 dicas para o produto "${productName}". Use palavras comuns e populares, fáceis de entender por um público geral. As dicas devem ser curtas, objetivas, e ordenadas da mais difícil para a mais fácil. É crucial que as dicas NÃO contenham o nome do produto "${productName}" ou variações diretas dele. A resposta do produto deve ser uma única palavra. Retorne apenas um array JSON de strings. Exemplo de retorno: ["dica 1", "dica 2", "dica 3", "dica 4", "dica 5"]`,
       config: {
        systemInstruction: "Você é um assistente criativo para um jogo de adivinhação. Todas as suas respostas devem ser estritamente em português do Brasil.",
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
      },
    });
    const jsonText = response.text.trim();
    const clues = JSON.parse(jsonText);
    return Array.isArray(clues) && clues.length === 5 ? clues : Promise.reject("Formato de dicas inválido.");
  } catch (error) {
    console.error("Erro ao gerar dicas com IA:", error);
    showToast("Não foi possível gerar as dicas. Verifique o console.", "error");
    return [];
  }
}

async function fetchLastFinishedGame() {
    try {
        const response = await fetch('/api/caixa-misteriosa/last-finished');
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                setState({ lastFinishedGame: data.lastGame });
            }
        }
        // Erros 404 (não encontrado) são ignorados, pois significa apenas que não há jogos anteriores.
    } catch (error) {
        console.error("Erro ao buscar último jogo finalizado:", error);
    }
}

// --- MODAL HANDLERS ---
function showConfirmationModal(title: string, message: string, onConfirm: () => void) {
    setState({ modal: { title, message, onConfirm } });
}

function hideModal() {
    setState({ modal: null });
}


// --- EVENT HANDLERS ---

// Participant Handler
function handleParticipantSubmit(event: Event) {
    event.preventDefault();
    if (state.liveGame.status !== 'accepting') {
        showToast("As inscrições estão encerradas!", "error");
        return;
    }
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const participantUser: User = {
        id: Date.now().toString(), // Always generate a new ID for the submission itself
        name: formData.get('name') as string,
        phone: formData.get('phone') as string,
        neighborhood: formData.get('neighborhood') as string,
        city: formData.get('city') as string,
    };

    // Save user details for next time
    localStorage.setItem('mysteryBoxParticipantUser', JSON.stringify(participantUser));

    const newSubmission: Submission = {
        user: participantUser,
        guess: formData.get('guess') as string,
    };

    const updatedSubmissions = [...state.liveGame.submissions, newSubmission];
    localStorage.setItem(`submitted_${state.liveGame.giveaway?.productName || ''}`, 'true');
    setState({ hasSubmitted: true, participantDetails: participantUser });
    setLiveGameState({ submissions: updatedSubmissions });
}

// Operator Handlers
function handleStartNewGame(sponsor: Sponsor, product: Product) {
    showConfirmationModal('Iniciar Sorteio', `Deseja iniciar um novo sorteio com o produto "${product.name}"?`, () => {
        const newLiveGame: LiveGame = {
            status: 'accepting',
            giveaway: {
                sponsorName: sponsor.name,
                productName: product.name,
                clues: product.clues,
            },
            revealedCluesCount: 1, // Reveal first clue on start
            submissions: [],
            winner: null,
        };
        // The routing logic is now inside setLiveGameState
        setLiveGameState(newLiveGame);
    });
}

function handleRevealClue() {
    if (state.liveGame.revealedCluesCount < 5) {
        setLiveGameState({ revealedCluesCount: state.liveGame.revealedCluesCount + 1 });
    }
}

function handleEndSubmissions() {
    showConfirmationModal('Encerrar Palpites', "Tem certeza que deseja encerrar os palpites? Ninguém mais poderá participar.", () => {
        setLiveGameState({ status: 'closed' });
    });
}

function handleDrawWinner() {
    const correctAnswer = state.liveGame.giveaway?.productName.toLowerCase().trim();
    const winners = state.liveGame.submissions.filter(s => s.guess.toLowerCase().trim() === correctAnswer);
    if (winners.length > 0) {
        // 1. Prepare roulette data
        const MIN_ROULETTE_ITEMS = 50;
        let repeatedWinners = [...winners];
        while (repeatedWinners.length < MIN_ROULETTE_ITEMS) {
            repeatedWinners = repeatedWinners.concat(winners);
        }

        const rouletteItems = repeatedWinners
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value);

        // 2. Pick a winning index from the last "real" segment of the wheel
        const winnerIndex = rouletteItems.length - winners.length + Math.floor(Math.random() * winners.length);
        const actualWinner = rouletteItems[winnerIndex];

        const cardHeight = 80; // Corresponds to h-20 in Tailwind
        const containerHeight = 160; // Corresponds to h-40 in Tailwind
        // 3. Calculate the final Y position to center the winning card
        const finalTransformY = (winnerIndex * cardHeight) - ((containerHeight - cardHeight) / 2);

        // 4. Set state to trigger the animation
        setState({
            drawingWinner: true,
            rouletteData: {
                items: rouletteItems,
                finalTransformY: finalTransformY
            }
        });

        // 5. After animation, set the actual winner in the shared state
        setTimeout(() => {
            setLiveGameState({ winner: actualWinner, status: 'finished' });
        }, 6000); // Animation is 5.5s, give it a bit of buffer
    } else {
        showToast("Ninguém acertou. Não é possível sortear um vencedor.", "error");
    }
}

function handleResetGame() {
    showConfirmationModal('Resetar Jogo', "Isso irá apagar todos os dados do jogo atual e voltar para a tela inicial. Deseja continuar?", () => {
        clearLiveGameState(); // Notifies other tabs
        // Manually reset state for the current client (admin)
        setState({
            screen: 'adminSetup', // Admin should go back to the setup screen
            liveGame: getInitialLiveGameState(),
            hasSubmitted: false,
            drawingWinner: false,
            rouletteData: null,
        });
    });
}

function handleShareLink() {
    const url = window.location.href.split('?')[0].split('#')[0]; // Get clean URL
    navigator.clipboard.writeText(url).then(() => {
        showToast('Link de participação copiado!', 'success');
    }).catch(err => {
        console.error('Failed to copy link: ', err);
        showToast('Não foi possível copiar o link.', 'error');
    });
}

function handleReturnToAdmin() {
    // Recalculate the correct admin screen based on the live game's status
    let targetScreen = 'adminSetup';
    if (state.liveGame.status === 'accepting' || state.liveGame.status === 'closed') {
        targetScreen = 'operatorDashboard';
    } else if (state.liveGame.status === 'finished') {
        targetScreen = 'operatorResults';
    }
    setState({ screen: targetScreen });
}

// --- UI Feedback ---

function showToast(message: string, type: 'success' | 'error' = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toastId = `toast-${Date.now()}`;
    const toastElement = document.createElement('div');
    toastElement.id = toastId;

    const colors = {
        success: 'bg-green-600',
        error: 'bg-red-600',
    };

    toastElement.className = `
        px-4 py-3 rounded-lg text-white font-semibold shadow-lg
        transform transition-all duration-300 ease-out
        translate-x-full opacity-0 ${colors[type]}
    `;
    toastElement.textContent = message;

    toastContainer.appendChild(toastElement);

    // Animate in
    requestAnimationFrame(() => {
        toastElement.classList.remove('translate-x-full', 'opacity-0');
        toastElement.classList.add('translate-x-0', 'opacity-100');
    });


    // Animate out and remove after a delay
    setTimeout(() => {
        toastElement.classList.add('opacity-0', 'translate-x-full');
        toastElement.addEventListener('transitionend', () => {
            toastElement.remove();
        });
    }, 3000);
}


// --- RENDER FUNCTIONS ---

function render() {
  if (!appElement || !modalContainerElement) return;

  // Clear previous content
  appElement.innerHTML = '';
  modalContainerElement.innerHTML = '';

  if (state.loading) {
    appElement.innerHTML = `<div class="flex justify-center items-center h-screen"><div class="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500"></div></div>`;
    return;
  }
  
  // Render Modal
  modalContainerElement.innerHTML = getModalHTML();
  if (state.modal) {
      document.getElementById('modal-confirm-btn').addEventListener('click', () => {
          state.modal.onConfirm();
          hideModal();
      });
      document.getElementById('modal-cancel-btn').addEventListener('click', hideModal);
      document.getElementById('modal-overlay').addEventListener('click', hideModal);
  }


  switch (state.screen) {
    case 'welcome':
      appElement.innerHTML = getWelcomeScreenHTML();
      document.getElementById('participant-entry-btn').addEventListener('click', () => {
          if (state.liveGame.status === 'pending') {
              setState({ screen: 'participantWaiting' });
          } else {
              setState({ screen: 'participant' });
          }
      });
      document.getElementById('admin-entry-btn').addEventListener('click', () => {
          if (state.user?.id === 'admin') {
              handleReturnToAdmin();
          } else {
              setState({ screen: 'adminLogin' });
          }
      });
      break;
    case 'participantWaiting':
        appElement.innerHTML = getParticipantWaitingScreenHTML();
        document.getElementById('back-to-welcome-btn').addEventListener('click', () => setState({ screen: 'welcome' }));
        break;
    case 'participant':
      appElement.innerHTML = getParticipantScreenHTML();
      if (state.user?.id === 'admin') {
         document.getElementById('return-to-admin-btn').addEventListener('click', handleReturnToAdmin);
      }
      if (!state.hasSubmitted && state.liveGame.status === 'accepting') {
          document.getElementById('participant-form').addEventListener('submit', handleParticipantSubmit);
      }
      break;
    case 'adminLogin':
        appElement.innerHTML = getAdminLoginHTML();
        document.getElementById('admin-login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const password = (document.getElementById('password') as HTMLInputElement).value;
            if (password === 'admin') { // Simple hardcoded password
                const adminUser: User = { id: 'admin', name: 'Admin', phone: '', city: '', neighborhood: '' };
                localStorage.setItem('mysteryBoxAdminUser', JSON.stringify(adminUser));
                setState({ user: adminUser });
                handleReturnToAdmin(); // Go to the correct admin screen
            } else {
                showToast('Senha incorreta!', 'error');
            }
        });
        document.getElementById('back-to-welcome-btn').addEventListener('click', () => setState({ screen: 'welcome' }));
        break;
    case 'adminSetup':
      appElement.innerHTML = getAdminSetupHTML();
      attachAdminSetupEventListeners();
      break;
    case 'operatorDashboard':
        appElement.innerHTML = getOperatorDashboardHTML();
        document.getElementById('reveal-clue-btn')?.addEventListener('click', handleRevealClue);
        document.getElementById('end-submissions-btn')?.addEventListener('click', handleEndSubmissions);
        document.getElementById('view-results-btn')?.addEventListener('click', () => setState({screen: 'operatorResults'}));
        document.getElementById('share-link-btn')?.addEventListener('click', handleShareLink);
        document.getElementById('switch-to-participant-view-btn')?.addEventListener('click', () => setState({ screen: 'participant' }));
        break;
    case 'operatorResults':
        appElement.innerHTML = getOperatorResultsHTML();
        document.getElementById('draw-winner-btn')?.addEventListener('click', handleDrawWinner);
        document.getElementById('reset-game-btn')?.addEventListener('click', handleResetGame);
        break;
  }
}

// --- HTML GETTERS ---

function getAdminHeaderHTML() {
    return `
    <div class="flex justify-between items-center mb-6">
        <div>
            <h1 class="text-3xl font-bold text-purple-400">Configurar Sorteio</h1>
        </div>
        <div class="flex items-center gap-4">
             <button id="switch-to-participant-view-btn" class="text-sm bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition">
                Ver como Participante
            </button>
            <button id="logout-admin-btn" class="text-gray-400 hover:text-white" title="Sair">&times; Sair</button>
        </div>
    </div>
    `;
}

function getModalHTML() {
    if (!state.modal) return '';
    return `
    <div id="modal-overlay" class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in-fast">
        <div class="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-sm text-center transform animate-scale-in" onclick="event.stopPropagation();">
            <h2 class="text-xl font-bold text-purple-400 mb-4">${state.modal.title}</h2>
            <p class="text-gray-300 mb-6">${state.modal.message}</p>
            <div class="flex gap-4">
                <button id="modal-cancel-btn" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition">Cancelar</button>
                <button id="modal-confirm-btn" class="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition">Confirmar</button>
            </div>
        </div>
    </div>
    <style>
        @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in-fast { animation: fade-in-fast 0.2s ease-out forwards; }
        @keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
    </style>
    `;
}

function getWelcomeScreenHTML() {
    return `
    <main class="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-gradient-to-b from-gray-900 to-purple-900">
      <h1 class="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
        Caixa Misteriosa
      </h1>
      <p class="text-md text-gray-400 mb-8 max-w-2xl">
        Adivinhe o prêmio, participe do sorteio e ganhe!
      </p>
      <div class="flex flex-col sm:flex-row gap-4">
         <button id="participant-entry-btn" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            Entrar como Participante
        </button>
         <button id="admin-entry-btn" class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            Acessar como Administrador
        </button>
      </div>
    </main>
  `;
}

function getParticipantWaitingScreenHTML() {
    return `
    <main class="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-gradient-to-b from-gray-900 to-purple-900">
         <div class="animate-pulse mb-4 text-6xl">⏳</div>
         <h1 class="text-4xl font-bold text-white mb-4">Aguardando o Sorteio</h1>
         <p class="text-lg text-gray-400">Nenhum sorteio ativo no momento. Por favor, aguarde o início.</p>
         <button id="back-to-welcome-btn" class="mt-8 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition">Voltar</button>
    </main>
    `;
}


function getAdminLoginHTML() {
    return `
     <main class="min-h-screen flex flex-col items-center justify-center p-4">
        <div class="w-full max-w-sm bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
            <h1 class="text-3xl font-bold text-center text-purple-400 mb-6">Acesso Restrito</h1>
            <form id="admin-login-form" class="space-y-4">
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-300">Senha</label>
                    <input type="password" id="password" name="password" required class="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-purple-500 focus:border-purple-500">
                </div>
                <button type="submit" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300">Entrar</button>
                <button type="button" id="back-to-welcome-btn" class="w-full text-center text-gray-400 hover:text-white mt-2">Voltar</button>
            </form>
        </div>
    </main>
    `
}

function getSubmissionsFeedHTML(submissions: Submission[]) {
    const submissionsList = submissions.length > 0
        ? [...submissions].reverse().map(s => `
            <div class="bg-gray-700/50 p-3 rounded-lg animate-fade-in">
                <span class="font-bold text-purple-300">${s.user.name}:</span>
                <span class="text-white">${s.guess}</span>
            </div>`).join('')
        : '<p class="text-gray-400 text-center">Aguardando o primeiro palpite...</p>';

    return `
        <div class="w-full max-w-md mt-8">
            <h3 class="text-xl font-semibold text-center text-white mb-4">Palpites Enviados (${submissions.length})</h3>
            <div class="bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 h-64 overflow-y-auto space-y-2">
                ${submissionsList}
            </div>
        </div>
    `;
}

function getParticipantResultsHTML(winner: Submission, productName: string) {
    return `
        <main class="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-gradient-to-b from-gray-900 to-purple-900">
             <div class="absolute inset-0 overflow-hidden">
                <div class="confetti"></div><div class="confetti"></div><div class="confetti"></div>
                <div class="confetti"></div><div class="confetti"></div><div class="confetti"></div>
                <div class="confetti"></div><div class="confetti"></div><div class="confetti"></div>
                <div class="confetti"></div><div class="confetti"></div><div class="confetti"></div>
            </div>
            <div class="animate-popup z-10">
                <h1 class="text-5xl font-bold text-green-400 mb-4">Temos um Vencedor!</h1>
                <p class="text-lg text-gray-300 mb-4">O prêmio era: <span class="font-bold text-white">${productName}</span></p>
                <div class="bg-white/10 p-6 rounded-lg inline-block">
                    <p class="text-2xl text-gray-200">Parabéns para</p>
                    <p class="text-4xl font-bold text-white mt-2">${winner.user.name}</p>
                    <p class="text-md text-gray-400">${winner.user.city} - ${winner.user.neighborhood}</p>
                </div>
                <p class="mt-8 text-gray-400">Obrigado a todos por participarem! Aguardem o próximo sorteio.</p>
            </div>
            <style>
              @keyframes popup { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } } 
              .animate-popup { animation: popup 0.5s ease-out forwards; }
              .confetti {
                  width: 15px; height: 15px; background-color: #f0f; position: absolute; left: 50%;
                  animation: confetti-fall 5s linear infinite;
              }
              .confetti:nth-child(1) { background-color: #f0a; left: 10%; animation-delay: 0s; }
              .confetti:nth-child(2) { background-color: #a0f; left: 20%; animation-delay: -0.5s; }
              .confetti:nth-child(3) { background-color: #0af; left: 30%; animation-delay: -1s; }
              .confetti:nth-child(4) { background-color: #0fa; left: 40%; animation-delay: -1.5s; }
              .confetti:nth-child(5) { background-color: #af0; left: 50%; animation-delay: -2s; }
              .confetti:nth-child(6) { background-color: #fa0; left: 60%; animation-delay: -2.5s; }
              .confetti:nth-child(7) { background-color: #f0a; left: 70%; animation-delay: -3s; }
              .confetti:nth-child(8) { background-color: #a0f; left: 80%; animation-delay: -3.5s; }
              .confetti:nth-child(9) { background-color: #0af; left: 90%; animation-delay: -4s; }
              .confetti:nth-child(10){ background-color: #0fa; left: 100%; animation-delay: -4.5s;}
              @keyframes confetti-fall {
                  0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
                  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
              }
            </style>
        </main>
    `;
}

function getParticipantScreenHTML() {
    const { giveaway, revealedCluesCount, status, submissions, winner } = state.liveGame;
    const { participantDetails } = state;

    if (!giveaway) {
        return `<main class="min-h-screen flex items-center justify-center"><p>Sorteio não encontrado ou finalizado. Voltando...</p></main>`;
    }

    if (status === 'finished' && winner) {
        return getParticipantResultsHTML(winner, giveaway.productName);
    }
    
    const adminReturnBar = state.user?.id === 'admin' ? `
    <div class="fixed top-0 left-0 right-0 bg-blue-800 text-white p-3 text-center z-50 shadow-lg">
        Você está vendo como participante. 
        <button id="return-to-admin-btn" class="font-bold underline hover:text-blue-200 ml-2">Voltar ao Painel do Admin</button>
    </div>
    ` : '';

    const revealedClues = giveaway.clues.slice(0, revealedCluesCount).map((clue, index) =>
        `<li class="bg-gray-800 p-3 rounded-lg animate-reveal-clue text-gray-300" style="animation-delay: ${index * 150}ms;"><strong>Dica ${index + 1}:</strong> ${clue}</li>`
    ).join('');
    
    let formOrMessageHTML = '';
    if (status === 'closed' || status === 'finished') {
        formOrMessageHTML = `<div class="bg-red-900/50 text-red-300 p-4 rounded-lg text-center font-bold">Inscrições Encerradas! Aguarde o resultado.</div>`;
    } else if (state.hasSubmitted) {
        formOrMessageHTML = `<div class="bg-green-900/50 text-green-300 p-4 rounded-lg text-center font-bold">Boa sorte! Seu palpite foi enviado com sucesso.</div>`;
    } else {
        formOrMessageHTML = `
            <form id="participant-form" class="space-y-4 bg-gray-900/50 p-6 rounded-xl">
                <h3 class="text-2xl font-bold text-center text-purple-400 mb-4">Faça seu Palpite!</h3>
                <!-- Campos do usuário -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-300">Nome</label>
                        <input type="text" id="name" name="name" required class="mt-1 block w-full bg-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-purple-500" value="${participantDetails?.name || ''}">
                    </div>
                    <div>
                        <label for="phone" class="block text-sm font-medium text-gray-300">Telefone</label>
                        <input type="tel" id="phone" name="phone" required class="mt-1 block w-full bg-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-purple-500" value="${participantDetails?.phone || ''}">
                    </div>
                     <div>
                        <label for="neighborhood" class="block text-sm font-medium text-gray-300">Bairro</label>
                        <input type="text" id="neighborhood" name="neighborhood" required class="mt-1 block w-full bg-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-purple-500" value="${participantDetails?.neighborhood || ''}">
                    </div>
                    <div>
                        <label for="city" class="block text-sm font-medium text-gray-300">Cidade</label>
                        <input type="text" id="city" name="city" required class="mt-1 block w-full bg-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-purple-500" value="${participantDetails?.city || ''}">
                    </div>
                </div>
                 <!-- Campo do palpite -->
                 <div class="pt-2">
                    <label for="guess" class="block text-sm font-medium text-gray-300">Qual é o prêmio?</label>
                    <input type="text" id="guess" name="guess" required class="mt-1 block w-full bg-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-purple-500" autocomplete="off">
                </div>
                <button type="submit" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg text-lg transition-transform hover:-translate-y-1">Enviar Palpite</button>
            </form>
        `;
    }

    return `
    ${adminReturnBar}
    <main class="min-h-screen flex flex-col items-center justify-center p-4 ${state.user?.id === 'admin' ? 'pt-20' : ''}">
        <div class="w-full max-w-2xl bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8">
            <p class="text-center text-lg text-gray-400 mb-2">Um oferecimento de:</p>
            <h2 class="text-center text-3xl font-bold text-purple-400 mb-6">${giveaway.sponsorName}</h2>
             <div class="mb-6">
                <h3 class="text-xl font-semibold mb-4 text-center">Dicas Reveladas:</h3>
                <ul class="space-y-3">${revealedClues}</ul>
            </div>
            ${formOrMessageHTML}
        </div>
        ${getSubmissionsFeedHTML(submissions)}
    </main>
    <style>
      @keyframes reveal-clue { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      .animate-reveal-clue { 
        /* Ensure opacity is 0 initially to prevent flash of unstyled content */
        opacity: 0;
        animation: reveal-clue 0.5s ease-out forwards; 
      }
      @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
      .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
    </style>
    `;
}

function getOperatorDashboardHTML() {
    const { giveaway, revealedCluesCount, status, submissions } = state.liveGame;
    const isLastClue = revealedCluesCount >= 5;

    const submissionsList = submissions.length > 0
        ? [...submissions].reverse().map(s => `
            <div class="bg-gray-700/50 p-3 rounded-lg animate-fade-in">
                <span class="font-bold text-purple-300">${s.user.name}:</span>
                <span class="text-white">${s.guess}</span>
            </div>`).join('')
        : '<p class="text-gray-400 text-center py-16">Aguardando o primeiro palpite...</p>';

    return `
    <main class="min-h-screen flex flex-col items-center p-4 sm:p-6">
        <div class="w-full max-w-6xl bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h1 class="text-3xl font-bold text-purple-400">Painel do Operador</h1>
                    <p class="text-gray-300">Sorteio atual: <span class="font-bold text-white">${giveaway?.productName}</span></p>
                </div>
                <button id="switch-to-participant-view-btn" class="text-sm bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition whitespace-nowrap">
                    Ver como Participante
                </button>
            </div>


            <div class="mb-6 p-4 bg-gray-900/50 rounded-lg">
                <button id="share-link-btn" class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0m-4.242 6.364a2 2 0 010-2.828l3-3a2 2 0 012.828 0m-4.242 0l-3 3a2 2 0 11-2.828-2.828l3-3a2 2 0 012.828 0" clip-rule="evenodd" /></svg>
                    Copiar Link de Participação
                </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <!-- Coluna Esquerda: Controles e Dicas -->
                <div class="lg:col-span-3 space-y-6">
                    <!-- Painel de Controle -->
                    <div class="bg-gray-900/50 p-6 rounded-xl">
                        <h2 class="text-xl font-bold text-pink-400 mb-4">Controles do Jogo</h2>
                        <div class="space-y-3">
                            <button id="reveal-clue-btn" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed" ${isLastClue || status !== 'accepting' ? 'disabled' : ''}>
                               ${isLastClue ? 'Todas as dicas reveladas' : `Revelar Dica (${revealedCluesCount + 1}/5)`}
                            </button>
                            ${status === 'accepting' ? `
                            <button id="end-submissions-btn" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition">
                                Encerrar Palpites
                            </button>
                            ` : `
                            <button id="view-results-btn" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition">
                                Ver Resultados
                            </button>
                            `}
                        </div>
                        <div class="mt-4 border-t border-gray-700 pt-4">
                           <p class="text-lg font-bold text-center">Total de Palpites: <span class="text-2xl text-purple-400">${submissions.length}</span></p>
                        </div>
                    </div>
                    <!-- Dicas -->
                    <div class="bg-gray-900/50 p-6 rounded-xl">
                         <h2 class="text-xl font-bold text-pink-400 mb-4">Dicas</h2>
                         <ul class="space-y-2">
                            ${giveaway?.clues.map((clue, i) => `
                                <li class="p-2 rounded ${i < revealedCluesCount ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-500'}">
                                    <strong>Dica ${i+1}:</strong> ${clue}
                                </li>
                            `).join('')}
                         </ul>
                    </div>
                </div>

                <!-- Coluna Direita: Feed de Palpites -->
                <div class="lg:col-span-2">
                    <h2 class="text-xl font-bold text-pink-400 mb-4">Palpites ao Vivo</h2>
                    <div class="bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 h-[520px] overflow-y-auto space-y-2">
                         ${submissionsList}
                    </div>
                </div>
            </div>
        </div>
    </main>
    `;
}

function getOperatorResultsHTML() {
    const { giveaway, submissions, winner } = state.liveGame;
    const correctAnswer = giveaway?.productName.toLowerCase().trim();

    // Roullette animation screen
    if (state.drawingWinner && state.rouletteData) {
        const { items, finalTransformY } = state.rouletteData;
        const rouletteWheelHTML = items.map(w => `
            <div class="winner-card">
                <span>${w.user.name}</span>
            </div>
        `).join('');

        return `
        <main class="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-gray-900">
            <h1 class="text-4xl font-bold text-purple-400 mb-6 animate-pulse">Sorteando o vencedor...</h1>
            <div id="roulette-container" class="w-full max-w-md h-40 bg-gray-800/50 rounded-lg overflow-hidden relative border-2 border-purple-500 shadow-lg flex items-center">
                <div class="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-gray-900 via-gray-900/80 to-transparent z-10 pointer-events-none"></div>
                <div class="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent z-10 pointer-events-none"></div>
                <div class="absolute top-1/2 left-4 right-4 h-px bg-pink-500/70 -translate-y-1/2 z-20"></div>
                <div id="roulette-wheel" class="absolute top-0 left-0 w-full">
                    ${rouletteWheelHTML}
                </div>
            </div>
            <style>
                #roulette-wheel .winner-card {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 80px;
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: white;
                    text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
                }
                @keyframes spin {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-${finalTransformY}px); }
                }
                #roulette-wheel {
                    animation: spin 5.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
                }
            </style>
        </main>
        `;
    }

    const winners = submissions.filter(s => s.guess.toLowerCase().trim() === correctAnswer);

    const allSubmissionsHTML = submissions.map(s => {
        const isCorrect = s.guess.toLowerCase().trim() === correctAnswer;
        return `
        <tr class="border-b border-gray-700 ${isCorrect ? 'bg-green-900/50' : ''}">
            <td class="p-3 ${isCorrect ? 'font-bold text-green-300' : ''}">${s.user.name}</td>
            <td class="p-3">${s.user.phone}</td>
            <td class="p-3">${s.guess}</td>
        </tr>
        `;
    }).join('');

    if (winner) {
        return `
        <main class="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-gradient-to-b from-gray-900 to-green-900">
            <div class="animate-popup">
                <h1 class="text-5xl font-bold text-green-400 mb-4">Vencedor Sorteado!</h1>
                <div class="bg-white/10 p-6 rounded-lg inline-block">
                    <p class="text-2xl text-gray-300">${winner.user.name}</p>
                    <p class="text-lg text-gray-400">${winner.user.phone}</p>
                    <p class="text-3xl font-semibold text-white mt-2">Palpite: ${winner.guess}</p>
                </div>
                <button id="reset-game-btn" class="mt-8 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-xl shadow-lg">Iniciar Novo Jogo</button>
            </div>
            <style>
              @keyframes popup { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } } 
              .animate-popup { animation: popup 0.5s ease-out forwards; }
            </style>
        </main>
        `;
    }

    return `
     <main class="min-h-screen p-4 sm:p-6">
        <div class="w-full max-w-5xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8">
            <h1 class="text-3xl font-bold text-purple-400 mb-4">Resultados</h1>
            <p class="text-gray-300 mb-2">Resposta Correta: <span class="font-bold text-white">${giveaway?.productName}</span></p>
            <p class="text-gray-300 mb-6">Total de Acertos: <span class="font-bold text-white">${winners.length}</span></p>

            <div class="flex flex-col md:flex-row gap-6">
                <!-- Lista de Ganhadores -->
                <div class="flex-1">
                    <h2 class="text-xl font-bold text-green-400 mb-4">Participantes Aptos ao Sorteio (${winners.length})</h2>
                    <div class="bg-gray-900/60 p-4 rounded-xl h-96 overflow-y-auto space-y-2">
                        ${winners.length > 0 ? winners.map(w => `<div class="bg-gray-700 p-3 rounded"><p class="font-semibold">${w.user.name}</p><p class="text-sm text-gray-400">${w.user.phone}</p></div>`).join('') : '<p class="text-gray-400">Ninguém acertou o palpite.</p>'}
                    </div>
                     <button id="draw-winner-btn" class="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition" ${winners.length === 0 ? 'disabled' : ''}>Sortear Ganhador</button>
                </div>

                <!-- Todos os Palpites -->
                <div class="flex-1">
                    <h2 class="text-xl font-bold text-pink-400 mb-4">Todos os Palpites (${submissions.length})</h2>
                    <div class="bg-gray-900/60 rounded-xl h-96 overflow-y-auto">
                        <table class="w-full text-left">
                            <thead class="bg-gray-700"><tr><th class="p-3">Nome</th><th class="p-3">Telefone</th><th class="p-3">Palpite</th></tr></thead>
                            <tbody>${allSubmissionsHTML}</tbody>
                        </table>
                    </div>
                    <button id="reset-game-btn" class="w-full mt-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition">Resetar Jogo</button>
                </div>
            </div>
        </div>
    </main>
    `;
}

// --- ADMIN SETUP (Sponsors & Products) ---
// This part is mostly reused from the previous version, adapted to the new flow.

function getAdminSetupHTML() {
    const { view, currentSponsorId, currentProductId } = state.admin;
    const { lastFinishedGame } = state;

    let lastWinnerHTML = '';
    if (lastFinishedGame && lastFinishedGame.winner) {
        const { winner, id, productName } = lastFinishedGame;
        const winnerURL = `${window.location.origin}/caixa-misteriosa-pub/${id}`;
        lastWinnerHTML = `
        <div class="mb-6 p-4 bg-gray-900/50 rounded-lg border border-green-500">
            <h2 class="text-xl font-bold text-green-400 mb-3">Último Sorteio Finalizado</h2>
            <p class="text-gray-300 mb-1"><strong>Ganhador:</strong> ${winner.user_name} (${winner.user_neighborhood || 'bairro não informado'})</p>
            <p class="text-gray-300 mb-1"><strong>Telefone:</strong> ${winner.user_phone}</p>
            <p class="text-gray-300 mb-3"><strong>Prêmio:</strong> ${productName}</p>
            <a href="${winnerURL}" target="_blank" class="text-sm text-cyan-400 hover:underline">Ver Página do Sorteio &rarr;</a>
        </div>
        `;
    }

    const baseLayout = (header: string, content: string) => `
    <main class="min-h-screen p-4 sm:p-6 md:p-8">
        <div class="w-full max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8">
            ${header}
            ${content}
        </div>
    </main>
    `;

    if (view === 'listSponsors') {
        const sponsorsList = state.sponsors.map(s => `
            <li class="flex justify-between items-center bg-gray-700 p-4 rounded-lg">
                <span class="font-semibold">${s.name}</span>
                <div class="space-x-2">
                    <button class="edit-sponsor-btn text-blue-300 hover:text-blue-200" data-id="${s.id}">✏️ Gerenciar Produtos</button>
                </div>
            </li>`).join('');
        const content = `
            ${lastWinnerHTML}
            <div class="mb-6 p-4 bg-gray-900/50 rounded-lg text-center">
                 <p class="text-gray-300 mb-2">Envie este link para os participantes:</p>
                 <button id="share-link-btn" class="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0m-4.242 6.364a2 2 0 010-2.828l3-3a2 2 0 012.828 0m-4.242 0l-3 3a2 2 0 11-2.828-2.828l3-3a2 2 0 012.828 0" clip-rule="evenodd" /></svg>
                    Copiar Link do Sorteio
                </button>
            </div>
            <ul class="space-y-3 mb-6">${sponsorsList || '<p class="text-gray-400">Nenhum patrocinador cadastrado.</p>'}</ul>
            <form id="add-sponsor-form" class="flex gap-3"><input type="text" name="sponsorName" placeholder="Nome do Novo Patrocinador" required class="flex-grow bg-gray-700 rounded-md py-2 px-3 text-white"><button type="submit" class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg">Adicionar</button></form>`;
        return baseLayout(getAdminHeaderHTML(), content);
    }

    if (view === 'editSponsor' || view === 'editProduct') {
        const sponsor = state.sponsors.find(s => s.id === currentSponsorId);
        if (!sponsor) return baseLayout('<h1>Erro</h1>', '<p>Patrocinador não encontrado.</p>');

        const header = `
        <div class="flex justify-between items-center mb-6">
            <div>
                 <h1 class="text-3xl font-bold text-purple-400">Gerenciando: ${sponsor.name}</h1>
            </div>
            <div>
                <button id="back-to-sponsors-btn" class="text-gray-400 hover:text-white">← Voltar</button>
            </div>
        </div>`;

        const productsList = sponsor.products.map(p => `
            <li class="flex justify-between items-center bg-gray-700 p-4 rounded-lg">
                <div>
                    <span class="font-semibold block">${p.name}</span>
                    <span class="text-xs text-gray-400">${p.clues.filter(c => c).length}/5 dicas</span>
                </div>
                <div class="space-x-2">
                    <button class="start-game-btn bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded-lg text-sm" data-sponsor-id="${sponsor.id}" data-product-id="${p.id}" ${p.clues.filter(c=>c).length < 5 ? 'disabled title="Complete as 5 dicas para iniciar"': ''}>▶ Iniciar</button>
                    <button class="edit-product-btn text-blue-300 hover:text-blue-200" data-sponsor-id="${sponsor.id}" data-product-id="${p.id}">✏️ Editar</button>
                </div>
            </li>`).join('');

        let productFormHTML = '';
        if (view === 'editProduct') {
            const product = currentProductId ? sponsor.products.find(p => p.id === currentProductId) : null;
            const clues = product ? product.clues : ['', '', '', '', ''];
            productFormHTML = `
                <div class="bg-gray-900/50 p-6 rounded-xl mt-6">
                    <h3 class="text-xl font-bold mb-4 text-pink-400">${product ? 'Editar Produto' : 'Novo Produto'}</h3>
                    <form id="product-form" class="space-y-4">
                        <input type="text" id="productName" name="productName" value="${product?.name || ''}" placeholder="Nome do Produto" required class="block w-full bg-gray-700 rounded-md py-2 px-3 text-white">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          ${[1,2,3,4,5].map(i => `<input type="text" id="clue${i}" name="clue${i}" value="${clues[i-1] || ''}" placeholder="Dica ${i}" required class="block w-full bg-gray-700 rounded-md py-2 px-3 text-white">`).join('')}
                        </div>
                        <div class="flex gap-3 pt-2">
                           <button type="button" id="generate-clues-btn" class="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg">Gerar Dicas com IA</button>
                           <button type="submit" class="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg">Salvar Produto</button>
                        </div>
                    </form>
                </div>`;
        }

        const content = `
            <h2 class="text-2xl font-bold text-pink-400 mb-4">Produtos de ${sponsor.name}</h2>
            <ul class="space-y-3">${productsList || '<p class="text-gray-400">Nenhum produto cadastrado.</p>'}</ul>
            <button id="add-product-btn" class="w-full mt-6 bg-pink-600/80 hover:bg-pink-700/80 text-white font-bold py-3 px-4 rounded-lg">Adicionar Novo Produto</button>
            ${productFormHTML}
        `;
        return baseLayout(header, content);
    }
    return '';
}

function attachAdminSetupEventListeners() {
    const { view, currentSponsorId } = state.admin;

    if (view === 'listSponsors') {
        document.getElementById('share-link-btn')?.addEventListener('click', handleShareLink);
        document.getElementById('switch-to-participant-view-btn')?.addEventListener('click', () => {
             if (state.liveGame.status === 'pending') {
              setState({ screen: 'participantWaiting' });
            } else {
              setState({ screen: 'participant' });
            }
        });
        document.getElementById('add-sponsor-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const sponsorName = new FormData(e.target as HTMLFormElement).get('sponsorName') as string;
            if (!sponsorName) return;
            const newSponsor: Sponsor = { id: Date.now().toString(), name: sponsorName, products: [] };
            const updatedSponsors = [...state.sponsors, newSponsor];
            setState({ sponsors: updatedSponsors });
            saveSponsorsToLocalStorage();
            (e.target as HTMLFormElement).reset();
            showToast('Patrocinador adicionado com sucesso!');
        });
        document.querySelectorAll('.edit-sponsor-btn').forEach(btn => btn.addEventListener('click', (e) => {
            const sponsorId = (e.currentTarget as HTMLElement).dataset.id;
            setState({ admin: { ...state.admin, view: 'editSponsor', currentSponsorId: sponsorId }});
        }));
        document.getElementById('logout-admin-btn')?.addEventListener('click', () => {
            localStorage.removeItem('mysteryBoxAdminUser');
            setState({ user: null, screen: 'welcome' });
        });
    }

    if (view === 'editSponsor' || view === 'editProduct') {
        document.getElementById('back-to-sponsors-btn')?.addEventListener('click', () => setState({ admin: { ...state.admin, view: 'listSponsors' } }));
        document.getElementById('add-product-btn')?.addEventListener('click', () => setState({ admin: { ...state.admin, view: 'editProduct', currentProductId: null } }));

        document.querySelectorAll('.edit-product-btn').forEach(btn => btn.addEventListener('click', (e) => {
            const { sponsorId, productId } = (e.currentTarget as HTMLElement).dataset;
            setState({ admin: { ...state.admin, view: 'editProduct', currentSponsorId: sponsorId, currentProductId: productId } });
        }));

        document.querySelectorAll('.start-game-btn').forEach(btn => btn.addEventListener('click', (e) => {
            const { sponsorId, productId } = (e.currentTarget as HTMLElement).dataset;
            const sponsor = state.sponsors.find(s => s.id === sponsorId);
            const product = sponsor?.products.find(p => p.id === productId);
            if (sponsor && product) {
                handleStartNewGame(sponsor, product);
            }
        }));
    }

    if (view === 'editProduct') {
        document.getElementById('product-form')?.addEventListener('submit', (event) => {
            event.preventDefault();
            const form = event.target as HTMLFormElement;
            const formData = new FormData(form);
            const productName = formData.get('productName') as string;
            const clues = [1,2,3,4,5].map(i => formData.get(`clue${i}`) as string);
            
            const sponsors = JSON.parse(JSON.stringify(state.sponsors));
            const sponsor = sponsors.find(s => s.id === currentSponsorId);

            if (state.admin.currentProductId) { // Editing
                const productIndex = sponsor.products.findIndex(p => p.id === state.admin.currentProductId);
                sponsor.products[productIndex] = { ...sponsor.products[productIndex], name: productName, clues };
            } else { // Adding
                const newProduct: Product = { id: Date.now().toString(), name: productName, clues };
                sponsor.products.push(newProduct);
            }
            setState({ sponsors, admin: { ...state.admin, view: 'editSponsor', currentProductId: null } });
            saveSponsorsToLocalStorage();
            showToast('Produto salvo com sucesso!');
        });

        document.getElementById('generate-clues-btn')?.addEventListener('click', async () => {
            const productNameInput = document.getElementById('productName') as HTMLInputElement;
            const productName = productNameInput.value;
            if (!productName) {
                showToast("Insira o nome do produto.", "error");
                return;
            }
            
            const btn = document.getElementById('generate-clues-btn');
            btn.textContent = 'Gerando...';
            btn.setAttribute('disabled', 'true');
            const clues = await generateCluesWithAI(productName);
            if (clues.length === 5) {
                for (let i = 0; i < 5; i++) {
                    (document.getElementById(`clue${i + 1}`) as HTMLInputElement).value = clues[i];
                }
            }
            btn.textContent = 'Gerar Dicas com IA';
            btn.removeAttribute('disabled');
        });
    }
}


// --- Global State Setter ---
function setState(newState) {
  state = { ...state, ...newState };
  render();
}

// --- App Start ---
loadInitialState();
render();