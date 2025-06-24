import './style.css';

const ITEMS_PER_PAGE = 12;
const API_AUTH_TOKEN = import.meta.env.VITE_API_AUTH_TOKEN;

const API_URLS = {
    CHATS_LIST: import.meta.env.VITE_CHATS_LIST,
    CHAT_SESSIONS_PREFIX: import.meta.env.VITE_CHAT_SESSIONS,
    SESSION_DETAILS_PREFIX: import.meta.env.VITE_SESSION_DETAILS
};

const SortOption = {
    NEWEST: 'newest',
    OLDEST: 'oldest',
    HIGHEST_SUCCESS: 'highest_success',
    LOWEST_SUCCESS: 'lowest_success',
};

const fetchWithAuth = async (url, options = {}) => {
    const headers = {
        ...options.headers,
        'Authorization': API_AUTH_TOKEN,
        'Content-Type': 'application/json'
    };
    const fetchOptions = { ...options, headers };

    try {
        const response = await fetch(url, fetchOptions);
        if (!response.ok) {
            let errorBody = 'Request failed';
            try { errorBody = await response.text(); } catch (e) {  }
            throw new Error(`API Error: ${response.status} ${response.statusText}. ${errorBody}`);
        }
        const text = await response.text();
        return text ? JSON.parse(text) : {};
    } catch (error) {
        console.error(`Fetch error for ${url}:`, error);
        throw error;
    }
};

const fetchAvailableChats = async () => {
    return fetchWithAuth(API_URLS.CHATS_LIST);
};

const fetchChatSessions = async (chatId, page = 1, perPage = ITEMS_PER_PAGE, sort = SortOption.HIGHEST_SUCCESS) => {
    const url = `${API_URLS.CHAT_SESSIONS_PREFIX}${chatId}?page=${page}&per_page=${perPage}&sort=${sort}`;
    return fetchWithAuth(url);
};

const fetchSessionDetails = async (chatId, sessionId) => {
    const url = `${API_URLS.SESSION_DETAILS_PREFIX}${chatId}/session/${sessionId}`;
    return fetchWithAuth(url);
};

const rootElement = document.getElementById('root');

let availableChats = [];
let allChatSessions = [];
let isLoading = true;
let isLoadingSessions = false;
let currentChatName = '';
let currentChatId = null;
let error = null;
let selectedSession = null;
let isLoadingModalMessages = false;
let modalError = null;

let currentPage = 1;
let totalPages = 1;
let currentSortOption = SortOption.HIGHEST_SUCCESS;

const formatDate = (isoString) => {
    if (!isoString) return 'Date N/A';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleString([], {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};

const getPotentialColorAndText = (potentialStr) => {
    if (potentialStr === null || potentialStr === undefined) return { barColor: 'bg-slate-300', textColor: 'text-slate-500', label: 'Analysis N/A', potential: 'N/A' };
    const potential = parseInt(potentialStr, 10);
    if (isNaN(potential)) return { barColor: 'bg-slate-300', textColor: 'text-slate-500', label: 'Invalid Data', potential: 'Error' };

    if (potential >= 70) return { barColor: 'bg-green-500', textColor: 'text-green-700', label: 'High Success', potential };
    if (potential >= 40) return { barColor: 'bg-yellow-400', textColor: 'text-yellow-700', label: 'Medium Success', potential };
    return { barColor: 'bg-red-500', textColor: 'text-red-700', label: 'Low Success', potential };
};

const renderLoadingSpinner = (size = 'md', color = 'text-green-600') => {
    const sizeClasses = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };
    return `
    <svg 
      class="animate-spin ${sizeClasses[size]} ${color}" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  `;
};

const renderHeader = () => {
    return `
    <header class="bg-white shadow-md">
      <div class="container mx-auto px-4 py-5 md:px-6 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <span class="material-symbols-outlined text-3xl text-green-600">forum</span>
          <h1 class="text-2xl font-semibold text-slate-700">Sales Leads Dashboard ${currentChatName ? `- ${currentChatName}` : ''}</h1>
        </div>
        <div class="flex items-center space-x-2 text-green-700">
            <span class="material-symbols-outlined">battery_charging_full</span>
            <span class="font-medium">BatteryEVO</span>
        </div>
      </div>
    </header>
  `;
};

const renderChatSelector = () => {
    if (availableChats.length === 0 && !isLoading) return '';

    return `
    <div class="mb-6 p-4 bg-white rounded-lg shadow">
      <label for="chat-select" class="block text-sm font-medium text-slate-700 mb-2">
        Select ChatBot:
      </label>
      <div class="relative w-full sm:w-auto control-select-wrapper">
        <select id="chat-select" class="block w-full appearance-none rounded-md border border-slate-300 bg-white py-2.5 pl-3 pr-10 text-base text-slate-700 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm">
          <option value="" disabled ${!currentChatId ? 'selected' : ''}>Select a ChatBot...</option>
          ${availableChats.map(chat => `
            <option value="${chat.chat_id}" ${currentChatId === chat.chat_id ? 'selected' : ''}>
              ${chat.chat_name}
            </option>
          `).join('')}
        </select>
        <span class="material-symbols-outlined text-xl text-slate-500">expand_more</span>
      </div>
    </div>
  `;
};

const renderSortControls = () => {
    if (!currentChatId) return '';

    const sortOptionsConfig = [
        { value: SortOption.HIGHEST_SUCCESS, label: 'Highest Success' },
        { value: SortOption.LOWEST_SUCCESS, label: 'Lowest Success' },
        { value: SortOption.NEWEST, label: 'Newest First (Last Updated)' },
        { value: SortOption.OLDEST, label: 'Oldest First (Last Updated)' },
    ];
    return `
    <div class="mb-6 flex flex-col sm:flex-row justify-between items-center p-4 bg-white rounded-lg shadow">
      <label for="sort-select" class="block text-sm font-medium text-slate-700 mb-2 sm:mb-0 sm:mr-3">
        Sort by:
      </label>
      <div class="relative w-full sm:w-auto control-select-wrapper">
        <select id="sort-select" class="block w-full appearance-none rounded-md border border-slate-300 bg-white py-2.5 pl-3 pr-10 text-base text-slate-700 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm">
          ${sortOptionsConfig.map(option => `
            <option value="${option.value}" ${currentSortOption === option.value ? 'selected' : ''}>
              ${option.label}
            </option>
          `).join('')}
        </select>
        <span class="material-symbols-outlined text-xl text-slate-500">expand_more</span>
      </div>
    </div>
  `;
};

const renderChatSessionCard = (session) => {
    const { barColor, textColor, label, potential } = getPotentialColorAndText(session.ai_success_eval);
    const formattedDate = formatDate(session.last_updated);
    const justification = session.ai_summary || 'Summary not available.';

    let displaySessionId = 'ID N/A';
    let titleSessionId = 'Session ID Not Available';

    if (session && typeof session.session_id === 'string' && session.session_id.length > 0) {
        titleSessionId = session.session_id;
        displaySessionId = session.session_id.length > 12
            ? session.session_id.substring(0, 12) + '...'
            : session.session_id;
    }

    return `
    <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      <div class="p-5 flex-grow">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h3 class="text-lg font-semibold text-slate-800 leading-tight truncate" title="Session ID: ${titleSessionId}">
              Session ID: ${displaySessionId}
            </h3>
            <p class="text-xs text-slate-500">${formattedDate}</p>
          </div>
        </div>

        <div class="mb-3">
          <div class="flex justify-between items-center mb-1">
            <span class="text-sm font-medium ${textColor}">${label}</span>
            <span class="text-xl font-bold ${textColor}">${potential}${potential !== 'N/A' && potential !== 'Error' ? '%' : ''}</span>
          </div>
          <div class="w-full bg-slate-200 rounded-full h-2.5">
            <div 
              class="${barColor} h-2.5 rounded-full transition-all duration-500 ease-out" 
              style="width: ${potential !== 'N/A' && potential !== 'Error' ? potential : 0}%;"
            ></div>
          </div>
        </div>
        <p class="text-sm text-slate-600 italic line-clamp-2" title="${justification}">
          "${justification}"
        </p>
      </div>
      
      <div class="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between space-x-2">
        <button
          data-session-id="${session.session_id}"
          class="view-chat-btn flex items-center justify-center text-sm bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 w-full"
          ${!(session && session.session_id) ? 'disabled' : ''} 
        >
          <span class="material-symbols-outlined text-base mr-1.5">visibility</span>
          View Chat
        </button>
      </div>
    </div>
  `;
};

const renderChatSessionList = (sessions) => {
    if (!currentChatId) {
        return `<p class="text-center text-slate-500 py-8 text-lg">Select a ChatBot from the dropdown to view its sessions.</p>`;
    }
    if (isLoadingSessions) {
        return `<div class="flex justify-center py-10">${renderLoadingSpinner('md')} <span class="ml-2 text-slate-600">Loading sessions for ${currentChatName}...</span></div>`;
    }
    if (sessions.length === 0) {
        return `<p class="text-center text-slate-500 py-8 text-lg">No chat sessions found for ${currentChatName}.</p>`;
    }
    return `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${sessions.map(session => renderChatSessionCard(session)).join('')}
    </div>
  `;
};

const renderPagination = () => {
    if (!currentChatId || totalPages <= 1 || isLoadingSessions) return '';

    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return `
    <nav class="flex justify-center items-center space-x-2 mt-8 mb-4" aria-label="Pagination">
      <button
        data-page="${Math.max(1, currentPage - 1)}"
        ${currentPage === 1 ? 'disabled' : ''}
        class="page-btn px-3 py-2 text-slate-600 bg-white rounded-md shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span class="material-symbols-outlined text-xl align-middle">chevron_left</span>
      </button>

      ${startPage > 1 ? `
        <button data-page="1" class="page-btn px-4 py-2 text-slate-600 bg-white rounded-md shadow-sm hover:bg-slate-50 transition-colors">1</button>
        ${startPage > 2 ? `<span class="text-slate-500">...</span>` : ''}
      ` : ''}

      ${pageNumbers.map(number => `
        <button
          data-page="${number}"
          class="page-btn px-4 py-2 rounded-md shadow-sm transition-colors ${
        currentPage === number
            ? 'bg-green-600 text-white font-medium'
            : 'bg-white text-slate-600 hover:bg-slate-50'
    }"
        >
          ${number}
        </button>
      `).join('')}

      ${endPage < totalPages ? `
        ${endPage < totalPages - 1 ? `<span class="text-slate-500">...</span>` : ''}
        <button data-page="${totalPages}" class="page-btn px-4 py-2 text-slate-600 bg-white rounded-md shadow-sm hover:bg-slate-50 transition-colors">${totalPages}</button>
      ` : ''}

      <button
        data-page="${Math.min(totalPages, currentPage + 1)}"
        ${currentPage === totalPages ? 'disabled' : ''}
        class="page-btn px-3 py-2 text-slate-600 bg-white rounded-md shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span class="material-symbols-outlined text-xl align-middle">chevron_right</span>
      </button>
    </nav>
  `;
};

const renderChatModalContent = () => {
    if (!selectedSession) return '';

    const renderMessageBubble = (message) => {
        const isUser = message.message_type === 'human';
        const bubbleClasses = isUser
            ? 'bg-green-500 text-white self-end rounded-l-lg rounded-br-lg'
            : 'bg-slate-200 text-slate-800 self-start rounded-r-lg rounded-bl-lg';
        const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return `
      <div class="flex flex-col mb-3 ${isUser ? 'items-end' : 'items-start'}">
        <div class="max-w-xs md:max-w-md lg:max-w-lg p-3 shadow ${bubbleClasses}">
          <p class="text-sm whitespace-pre-wrap">${message.message}</p>
        </div>
        <span class="text-xs mt-1 ${isUser ? 'text-slate-400 mr-1' : 'text-slate-400 ml-1'}">
          ${formattedTime}
        </span>
      </div>
    `;
    };

    let messagesContent = '';
    if (isLoadingModalMessages) {
        messagesContent = `<div class="flex justify-center items-center h-full">${renderLoadingSpinner('md', 'text-slate-500')} <span class="ml-2 text-slate-500">Loading messages...</span></div>`;
    } else if (modalError) {
        messagesContent = `<p class="text-red-600 text-center">${modalError}</p>`;
    } else if (selectedSession.messages && selectedSession.messages.length > 0) {
        messagesContent = selectedSession.messages.map(msg => renderMessageBubble(msg)).join('');
    } else {
        messagesContent = `<p class="text-slate-500 text-center">No messages in this session.</p>`;
    }

    const { potential } = getPotentialColorAndText(selectedSession.ai_success_eval);
    const justification = selectedSession.ai_summary || "Summary not available.";
    const modalSessionId = (selectedSession && selectedSession.session_id) ? selectedSession.session_id : 'N/A';

    return `
    <div class="modal-content" role="document">
      <div class="flex justify-between items-center p-5 border-b border-slate-200">
        <h2 id="modal-title" class="text-xl font-semibold text-slate-700 truncate">Chat Session: ${modalSessionId}</h2>
        <button id="close-modal-btn" class="text-slate-400 hover:text-slate-600 transition-colors" aria-label="Close modal">
          <span class="material-symbols-outlined text-2xl">close</span>
        </button>
      </div>
      
      <div class="p-5 flex-grow overflow-y-auto space-y-2 bg-slate-50 min-h-[200px]">
        ${messagesContent}
      </div>

      <div class="p-5 border-t border-slate-200 bg-white">
        <h3 class="text-md font-semibold text-slate-700 mb-1">Session Analysis:</h3>
        <p class="text-2xl font-bold text-green-600 mb-1">${potential}${potential !== 'N/A' && potential !== 'Error' ? '%' : ''} Success</p>
        <p class="text-sm text-slate-600 italic">"${justification}"</p>
      </div>
      <div class="p-3 bg-slate-100 text-right">
          <button id="close-modal-footer-btn" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 text-sm">
              Close
          </button>
      </div>
    </div>
  `;
};

const renderModalContainer = () => {
    let modalElement = document.getElementById('chat-modal');
    if (!selectedSession) {
        if (modalElement) modalElement.classList.remove('active');
        return;
    }

    if (!modalElement) {
        modalElement = document.createElement('div');
        modalElement.id = 'chat-modal';
        modalElement.className = 'modal';
        modalElement.setAttribute('role', 'dialog');
        modalElement.setAttribute('aria-modal', 'true');
        modalElement.setAttribute('aria-labelledby', 'modal-title');
        document.body.appendChild(modalElement);

        modalElement.addEventListener('click', (e) => {
            if (e.target.id === 'chat-modal') {
                handleCloseModal();
            }
        });
    }

    modalElement.innerHTML = renderChatModalContent();
    modalElement.classList.add('active');

    const closeButton = modalElement.querySelector('#close-modal-btn');
    if (closeButton) closeButton.addEventListener('click', handleCloseModal);

    const footerCloseButton = modalElement.querySelector('#close-modal-footer-btn');
    if (footerCloseButton) footerCloseButton.addEventListener('click', handleCloseModal);

    if (closeButton) closeButton.focus();
};

const renderApp = () => {
    if (!rootElement) return;

    let content = '';
    if (isLoading) {
        content = `
      <div class="min-h-screen flex flex-col items-center justify-center text-slate-700">
        ${renderLoadingSpinner('lg')}
        <p class="mt-4 text-lg">Loading dashboard configuration...</p>
      </div>
    `;
    } else {
        content = `
      ${renderHeader()}
      <main class="container mx-auto px-4 py-8 md:px-6 md:py-12">
        ${error ? `
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong class="font-bold">Error:</strong>
            <span class="block sm:inline"> ${error}</span>
          </div>
        ` : ''}
        ${renderChatSelector()}
        ${currentChatId ? renderSortControls() : ''}
        
        ${renderChatSessionList(allChatSessions)}

        ${currentChatId && totalPages > 1 && !isLoadingSessions ? renderPagination() : ''}
      </main>
      <footer class="py-6 text-center text-sm text-slate-500">
        Sales Dashboard
      </footer>
    `;
    }

    rootElement.innerHTML = content;
    renderModalContainer();
    addEventListeners();
};

const loadChatSessionsForCurrentChat = async () => {
    if (!currentChatId) {
        allChatSessions = [];
        totalPages = 1;
        isLoadingSessions = false;
        renderApp();
        return;
    }

    isLoadingSessions = true;
    error = null;
    allChatSessions = [];
    renderApp();

    try {
        const data = await fetchChatSessions(currentChatId, currentPage, ITEMS_PER_PAGE, currentSortOption);
        allChatSessions = data.sessions || [];
        totalPages = data.num_pages || 1;
        if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
        else if (totalPages === 0) currentPage = 1;

    } catch (err) {
        console.error(`Error fetching sessions for chat ${currentChatId}:`, err);
        error = `Failed to load chat sessions for ${currentChatName}: ${err.message}.`;
        allChatSessions = [];
        totalPages = 1;
    } finally {
        isLoadingSessions = false;
        renderApp();
    }
};

const handleSelectSession = async (sessionId) => {
    if (!sessionId || !currentChatId) {
        console.warn("Attempted to select session with invalid ID or no current chat selected.");
        return;
    }
    const sessionSummary = allChatSessions.find(s => s.session_id === sessionId);
    if (!sessionSummary) return;

    selectedSession = { ...sessionSummary, messages: [] };
    isLoadingModalMessages = true;
    modalError = null;
    renderModalContainer();

    try {
        const details = await fetchSessionDetails(currentChatId, sessionId);
        selectedSession.messages = details.chat_log || [];
    } catch (err) {
        console.error(`Error fetching details for session ${sessionId}:`, err);
        modalError = `Failed to load messages: ${err.message}`;
        selectedSession.messages = [];
    } finally {
        isLoadingModalMessages = false;
        renderModalContainer();
    }
};

const handleCloseModal = () => {
    selectedSession = null;
    isLoadingModalMessages = false;
    modalError = null;
    renderModalContainer();
};

const handlePageChange = (page) => {
    const newPage = parseInt(page, 10);
    if (currentChatId && !isNaN(newPage) && newPage !== currentPage && newPage > 0 && newPage <= totalPages) {
        currentPage = newPage;
        loadChatSessionsForCurrentChat();
    }
};

const handleSortChange = (newSortOpt) => {
    if (currentChatId && newSortOpt !== currentSortOption) {
        currentSortOption = newSortOpt;
        currentPage = 1;
        loadChatSessionsForCurrentChat();
    }
};

const handleChatSelectionChange = (selectedChatId) => {
    if (!selectedChatId) {
        currentChatId = null;
        currentChatName = '';
        allChatSessions = [];
        totalPages = 1;
        currentPage = 1;
        error = null;
        renderApp();
        return;
    }

    const selectedChat = availableChats.find(c => c.chat_id === selectedChatId);
    if (selectedChat) {
        currentChatId = selectedChat.chat_id;
        currentChatName = selectedChat.chat_name;
        currentPage = 1;
        currentSortOption = SortOption.HIGHEST_SUCCESS;
        allChatSessions = [];
        loadChatSessionsForCurrentChat();
    }
};

const addEventListeners = () => {
    const chatSelect = document.getElementById('chat-select');
    if (chatSelect) {
        chatSelect.removeEventListener('change', handleChatSelectInternal);
        chatSelect.addEventListener('change', handleChatSelectInternal);
    }

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.removeEventListener('change', handleSortChangeInternal);
        sortSelect.addEventListener('change', handleSortChangeInternal);
    }

    document.querySelectorAll('.view-chat-btn').forEach(button => {
        button.removeEventListener('click', handleViewChatInternal);
        button.addEventListener('click', handleViewChatInternal);
    });

    document.querySelectorAll('.page-btn').forEach(button => {
        button.removeEventListener('click', handlePageChangeInternal);
        button.addEventListener('click', handlePageChangeInternal);
    });
};

function handleChatSelectInternal(e) { handleChatSelectionChange(e.target.value); }
function handleSortChangeInternal(e) { handleSortChange(e.target.value); }
function handleViewChatInternal(e) {
    const targetButton = e.currentTarget;
    if (targetButton && targetButton.dataset && targetButton.dataset.sessionId) {
        handleSelectSession(targetButton.dataset.sessionId);
    } else {
        console.warn("View chat button clicked without a session ID or button/dataset is undefined.");
    }
}
function handlePageChangeInternal(e) {
    const targetButton = e.currentTarget;
    if (!targetButton.disabled && targetButton.dataset) {
        handlePageChange(targetButton.dataset.page);
    }
}

const loadInitialData = async () => {
    isLoading = true;
    error = null;
    currentChatId = null;
    currentChatName = '';
    allChatSessions = [];
    availableChats = [];
    renderApp();

    try {
        const chatsData = await fetchAvailableChats();
        if (chatsData.chats && chatsData.chats.length > 0) {
            availableChats = chatsData.chats;
        } else {
            error = "No ChatBots available from the API. Please check configuration or API status.";
            availableChats = []
        }
    } catch (err) {
        console.error("Failed to load initial chat data (available chats):", err);
        error = `Failed to initialize dashboard (could not load ChatBots): ${err.message}.`;
        availableChats = [];
    } finally {
        isLoading = false;
        renderApp();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loadInitialData();
});
