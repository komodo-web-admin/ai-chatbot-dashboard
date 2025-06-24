(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const l of s)if(l.type==="childList")for(const d of l.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&o(d)}).observe(document,{childList:!0,subtree:!0});function a(s){const l={};return s.integrity&&(l.integrity=s.integrity),s.referrerPolicy&&(l.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?l.credentials="include":s.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function o(s){if(s.ep)return;s.ep=!0;const l=a(s);fetch(s.href,l)}})();const j=12,k="Basic U2VydmljZUBrb21vZG9zeXN0ZW0uY29tOktvbW9kbzIwMjUh",_={CHATS_LIST:"https://komodosystem.app.n8n.cloud/webhook/chats",CHAT_SESSIONS_PREFIX:"https://komodosystem.app.n8n.cloud/webhook/3699f7aa-54e0-46d5-b50d-eda395016cae/chats/",SESSION_DETAILS_PREFIX:"https://komodosystem.app.n8n.cloud/webhook/ce280f5d-d4f8-403a-ae82-95a2f18fc6d4/chats/"},p={NEWEST:"newest",OLDEST:"oldest",HIGHEST_SUCCESS:"highest_success",LOWEST_SUCCESS:"lowest_success"},I=async(e,t={})=>{const a={...t.headers,Authorization:k,"Content-Type":"application/json"},o={...t,headers:a};try{const s=await fetch(e,o);if(!s.ok){let d="Request failed";try{d=await s.text()}catch{}throw new Error(`API Error: ${s.status} ${s.statusText}. ${d}`)}const l=await s.text();return l?JSON.parse(l):{}}catch(s){throw console.error(`Fetch error for ${e}:`,s),s}},M=async()=>I(_.CHATS_LIST),B=async(e,t=1,a=j,o=p.HIGHEST_SUCCESS)=>{const s=`${_.CHAT_SESSIONS_PREFIX}${e}?page=${t}&per_page=${a}&sort=${o}`;return I(s)},U=async(e,t)=>{const a=`${_.SESSION_DETAILS_PREFIX}${e}/session/${t}`;return I(a)},N=document.getElementById("root");let f=[],u=[],y=!0,g=!1,h="",r=null,m=null,c=null,$=!1,v=null,i=1,n=1,S=p.HIGHEST_SUCCESS;const F=e=>{if(!e)return"Date N/A";const t=new Date(e);return isNaN(t.getTime())?"Invalid Date":t.toLocaleString([],{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})},H=e=>{if(e==null)return{barColor:"bg-slate-300",textColor:"text-slate-500",label:"Analysis N/A",potential:"N/A"};const t=parseInt(e,10);return isNaN(t)?{barColor:"bg-slate-300",textColor:"text-slate-500",label:"Invalid Data",potential:"Error"}:t>=70?{barColor:"bg-green-500",textColor:"text-green-700",label:"High Success",potential:t}:t>=40?{barColor:"bg-yellow-400",textColor:"text-yellow-700",label:"Medium Success",potential:t}:{barColor:"bg-red-500",textColor:"text-red-700",label:"Low Success",potential:t}},L=(e="md",t="text-green-600")=>`
    <svg 
      class="animate-spin ${{sm:"w-6 h-6",md:"w-10 h-10",lg:"w-16 h-16"}[e]} ${t}" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  `,z=()=>`
    <header class="bg-white shadow-md">
      <div class="container mx-auto px-4 py-5 md:px-6 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <span class="material-symbols-outlined text-3xl text-green-600">forum</span>
          <h1 class="text-2xl font-semibold text-slate-700">Sales Leads Dashboard ${h?`- ${h}`:""}</h1>
        </div>
        <div class="flex items-center space-x-2 text-green-700">
            <span class="material-symbols-outlined">battery_charging_full</span>
            <span class="font-medium">BatteryEVO</span>
        </div>
      </div>
    </header>
  `,G=()=>f.length===0&&!y?"":`
    <div class="mb-6 p-4 bg-white rounded-lg shadow">
      <label for="chat-select" class="block text-sm font-medium text-slate-700 mb-2">
        Select ChatBot:
      </label>
      <div class="relative w-full sm:w-auto control-select-wrapper">
        <select id="chat-select" class="block w-full appearance-none rounded-md border border-slate-300 bg-white py-2.5 pl-3 pr-10 text-base text-slate-700 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm">
          <option value="" disabled ${r?"":"selected"}>Select a ChatBot...</option>
          ${f.map(e=>`
            <option value="${e.chat_id}" ${r===e.chat_id?"selected":""}>
              ${e.chat_name}
            </option>
          `).join("")}
        </select>
        <span class="material-symbols-outlined text-xl text-slate-500">expand_more</span>
      </div>
    </div>
  `,R=()=>r?`
    <div class="mb-6 flex flex-col sm:flex-row justify-between items-center p-4 bg-white rounded-lg shadow">
      <label for="sort-select" class="block text-sm font-medium text-slate-700 mb-2 sm:mb-0 sm:mr-3">
        Sort by:
      </label>
      <div class="relative w-full sm:w-auto control-select-wrapper">
        <select id="sort-select" class="block w-full appearance-none rounded-md border border-slate-300 bg-white py-2.5 pl-3 pr-10 text-base text-slate-700 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm">
          ${[{value:p.HIGHEST_SUCCESS,label:"Highest Success"},{value:p.LOWEST_SUCCESS,label:"Lowest Success"},{value:p.NEWEST,label:"Newest First (Last Updated)"},{value:p.OLDEST,label:"Oldest First (Last Updated)"}].map(t=>`
            <option value="${t.value}" ${S===t.value?"selected":""}>
              ${t.label}
            </option>
          `).join("")}
        </select>
        <span class="material-symbols-outlined text-xl text-slate-500">expand_more</span>
      </div>
    </div>
  `:"",W=e=>{const{barColor:t,textColor:a,label:o,potential:s}=H(e.ai_success_eval),l=F(e.last_updated),d=e.ai_summary||"Summary not available.";let x="ID N/A",w="Session ID Not Available";return e&&typeof e.session_id=="string"&&e.session_id.length>0&&(w=e.session_id,x=e.session_id.length>12?e.session_id.substring(0,12)+"...":e.session_id),`
    <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
      <div class="p-5 flex-grow">
        <div class="flex justify-between items-start mb-3">
          <div>
            <h3 class="text-lg font-semibold text-slate-800 leading-tight truncate" title="Session ID: ${w}">
              Session ID: ${x}
            </h3>
            <p class="text-xs text-slate-500">${l}</p>
          </div>
        </div>

        <div class="mb-3">
          <div class="flex justify-between items-center mb-1">
            <span class="text-sm font-medium ${a}">${o}</span>
            <span class="text-xl font-bold ${a}">${s}${s!=="N/A"&&s!=="Error"?"%":""}</span>
          </div>
          <div class="w-full bg-slate-200 rounded-full h-2.5">
            <div 
              class="${t} h-2.5 rounded-full transition-all duration-500 ease-out" 
              style="width: ${s!=="N/A"&&s!=="Error"?s:0}%;"
            ></div>
          </div>
        </div>
        <p class="text-sm text-slate-600 italic line-clamp-2" title="${d}">
          "${d}"
        </p>
      </div>
      
      <div class="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between space-x-2">
        <button
          data-session-id="${e.session_id}"
          class="view-chat-btn flex items-center justify-center text-sm bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 w-full"
          ${e&&e.session_id?"":"disabled"} 
        >
          <span class="material-symbols-outlined text-base mr-1.5">visibility</span>
          View Chat
        </button>
      </div>
    </div>
  `},q=e=>r?g?`<div class="flex justify-center py-10">${L("md")} <span class="ml-2 text-slate-600">Loading sessions for ${h}...</span></div>`:e.length===0?`<p class="text-center text-slate-500 py-8 text-lg">No chat sessions found for ${h}.</p>`:`
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${e.map(t=>W(t)).join("")}
    </div>
  `:'<p class="text-center text-slate-500 py-8 text-lg">Select a ChatBot from the dropdown to view its sessions.</p>',V=()=>{if(!r||n<=1||g)return"";const e=[],t=5;let a=Math.max(1,i-Math.floor(t/2)),o=Math.min(n,a+t-1);o-a+1<t&&(a=Math.max(1,o-t+1));for(let s=a;s<=o;s++)e.push(s);return`
    <nav class="flex justify-center items-center space-x-2 mt-8 mb-4" aria-label="Pagination">
      <button
        data-page="${Math.max(1,i-1)}"
        ${i===1?"disabled":""}
        class="page-btn px-3 py-2 text-slate-600 bg-white rounded-md shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span class="material-symbols-outlined text-xl align-middle">chevron_left</span>
      </button>

      ${a>1?`
        <button data-page="1" class="page-btn px-4 py-2 text-slate-600 bg-white rounded-md shadow-sm hover:bg-slate-50 transition-colors">1</button>
        ${a>2?'<span class="text-slate-500">...</span>':""}
      `:""}

      ${e.map(s=>`
        <button
          data-page="${s}"
          class="page-btn px-4 py-2 rounded-md shadow-sm transition-colors ${i===s?"bg-green-600 text-white font-medium":"bg-white text-slate-600 hover:bg-slate-50"}"
        >
          ${s}
        </button>
      `).join("")}

      ${o<n?`
        ${o<n-1?'<span class="text-slate-500">...</span>':""}
        <button data-page="${n}" class="page-btn px-4 py-2 text-slate-600 bg-white rounded-md shadow-sm hover:bg-slate-50 transition-colors">${n}</button>
      `:""}

      <button
        data-page="${Math.min(n,i+1)}"
        ${i===n?"disabled":""}
        class="page-btn px-3 py-2 text-slate-600 bg-white rounded-md shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <span class="material-symbols-outlined text-xl align-middle">chevron_right</span>
      </button>
    </nav>
  `},X=()=>{if(!c)return"";const e=l=>{const d=l.message_type==="human",x=d?"bg-green-500 text-white self-end rounded-l-lg rounded-br-lg":"bg-slate-200 text-slate-800 self-start rounded-r-lg rounded-bl-lg",w=new Date(l.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return`
      <div class="flex flex-col mb-3 ${d?"items-end":"items-start"}">
        <div class="max-w-xs md:max-w-md lg:max-w-lg p-3 shadow ${x}">
          <p class="text-sm whitespace-pre-wrap">${l.message}</p>
        </div>
        <span class="text-xs mt-1 ${d?"text-slate-400 mr-1":"text-slate-400 ml-1"}">
          ${w}
        </span>
      </div>
    `};let t="";$?t=`<div class="flex justify-center items-center h-full">${L("md","text-slate-500")} <span class="ml-2 text-slate-500">Loading messages...</span></div>`:v?t=`<p class="text-red-600 text-center">${v}</p>`:c.messages&&c.messages.length>0?t=c.messages.map(l=>e(l)).join(""):t='<p class="text-slate-500 text-center">No messages in this session.</p>';const{potential:a}=H(c.ai_success_eval),o=c.ai_summary||"Summary not available.";return`
    <div class="modal-content" role="document">
      <div class="flex justify-between items-center p-5 border-b border-slate-200">
        <h2 id="modal-title" class="text-xl font-semibold text-slate-700 truncate">Chat Session: ${c&&c.session_id?c.session_id:"N/A"}</h2>
        <button id="close-modal-btn" class="text-slate-400 hover:text-slate-600 transition-colors" aria-label="Close modal">
          <span class="material-symbols-outlined text-2xl">close</span>
        </button>
      </div>
      
      <div class="p-5 flex-grow overflow-y-auto space-y-2 bg-slate-50 min-h-[200px]">
        ${t}
      </div>

      <div class="p-5 border-t border-slate-200 bg-white">
        <h3 class="text-md font-semibold text-slate-700 mb-1">Session Analysis:</h3>
        <p class="text-2xl font-bold text-green-600 mb-1">${a}${a!=="N/A"&&a!=="Error"?"%":""} Success</p>
        <p class="text-sm text-slate-600 italic">"${o}"</p>
      </div>
      <div class="p-3 bg-slate-100 text-right">
          <button id="close-modal-footer-btn" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 text-sm">
              Close
          </button>
      </div>
    </div>
  `},C=()=>{let e=document.getElementById("chat-modal");if(!c){e&&e.classList.remove("active");return}e||(e=document.createElement("div"),e.id="chat-modal",e.className="modal",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-labelledby","modal-title"),document.body.appendChild(e),e.addEventListener("click",o=>{o.target.id==="chat-modal"&&E()})),e.innerHTML=X(),e.classList.add("active");const t=e.querySelector("#close-modal-btn");t&&t.addEventListener("click",E);const a=e.querySelector("#close-modal-footer-btn");a&&a.addEventListener("click",E),t&&t.focus()},b=()=>{if(!N)return;let e="";y?e=`
      <div class="min-h-screen flex flex-col items-center justify-center text-slate-700">
        ${L("lg")}
        <p class="mt-4 text-lg">Loading dashboard configuration...</p>
      </div>
    `:e=`
      ${z()}
      <main class="container mx-auto px-4 py-8 md:px-6 md:py-12">
        ${m?`
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong class="font-bold">Error:</strong>
            <span class="block sm:inline"> ${m}</span>
          </div>
        `:""}
        ${G()}
        ${r?R():""}
        
        ${q(u)}

        ${r&&n>1&&!g?V():""}
      </main>
      <footer class="py-6 text-center text-sm text-slate-500">
        Sales Dashboard
      </footer>
    `,N.innerHTML=e,C(),Q()},A=async()=>{if(!r){u=[],n=1,g=!1,b();return}g=!0,m=null,u=[],b();try{const e=await B(r,i,j,S);u=e.sessions||[],n=e.num_pages||1,i>n&&n>0?i=n:n===0&&(i=1)}catch(e){console.error(`Error fetching sessions for chat ${r}:`,e),m=`Failed to load chat sessions for ${h}: ${e.message}.`,u=[],n=1}finally{g=!1,b()}},Z=async e=>{if(!e||!r){console.warn("Attempted to select session with invalid ID or no current chat selected.");return}const t=u.find(a=>a.session_id===e);if(t){c={...t,messages:[]},$=!0,v=null,C();try{const a=await U(r,e);c.messages=a.chat_log||[]}catch(a){console.error(`Error fetching details for session ${e}:`,a),v=`Failed to load messages: ${a.message}`,c.messages=[]}finally{$=!1,C()}}},E=()=>{c=null,$=!1,v=null,C()},K=e=>{const t=parseInt(e,10);r&&!isNaN(t)&&t!==i&&t>0&&t<=n&&(i=t,A())},J=e=>{r&&e!==S&&(S=e,i=1,A())},Y=e=>{if(!e){r=null,h="",u=[],n=1,i=1,m=null,b();return}const t=f.find(a=>a.chat_id===e);t&&(r=t.chat_id,h=t.chat_name,i=1,S=p.HIGHEST_SUCCESS,u=[],A())},Q=()=>{const e=document.getElementById("chat-select");e&&(e.removeEventListener("change",T),e.addEventListener("change",T));const t=document.getElementById("sort-select");t&&(t.removeEventListener("change",P),t.addEventListener("change",P)),document.querySelectorAll(".view-chat-btn").forEach(a=>{a.removeEventListener("click",O),a.addEventListener("click",O)}),document.querySelectorAll(".page-btn").forEach(a=>{a.removeEventListener("click",D),a.addEventListener("click",D)})};function T(e){Y(e.target.value)}function P(e){J(e.target.value)}function O(e){const t=e.currentTarget;t&&t.dataset&&t.dataset.sessionId?Z(t.dataset.sessionId):console.warn("View chat button clicked without a session ID or button/dataset is undefined.")}function D(e){const t=e.currentTarget;!t.disabled&&t.dataset&&K(t.dataset.page)}const ee=async()=>{y=!0,m=null,r=null,h="",u=[],f=[],b();try{const e=await M();e.chats&&e.chats.length>0?f=e.chats:(m="No ChatBots available from the API. Please check configuration or API status.",f=[])}catch(e){console.error("Failed to load initial chat data (available chats):",e),m=`Failed to initialize dashboard (could not load ChatBots): ${e.message}.`,f=[]}finally{y=!1,b()}};document.addEventListener("DOMContentLoaded",()=>{ee()});
