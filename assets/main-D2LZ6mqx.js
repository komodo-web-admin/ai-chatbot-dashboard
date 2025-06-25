import{i as te,g as se,o as ae}from"./index-8e6e89cb-Up9GA3BB.js";const le={apiKey:"AIzaSyAckCpUG2n7Evrf1s5XL7KmjE66f7bUcgU",authDomain:"aichatbot-dashboard.firebaseapp.com",projectId:"aichatbot-dashboard",storageBucket:"aichatbot-dashboard.appspot.com",messagingSenderId:"312569174924",appId:"1:312569174924:web:128f90d3d4a92d21ef94a9"},oe=te(le),ne=se(oe);ae(ne,T=>{T?re():window.location.pathname.includes("login.html")||(window.location.href="/ai-chatbot-dashboard/login.html")});function re(){const M="Basic U2VydmljZUBrb21vZG9zeXN0ZW0uY29tOktvbW9kbzIwMjUh",E={CHATS_LIST:"https://komodosystem.app.n8n.cloud/webhook/chats",CHAT_SESSIONS_PREFIX:"https://komodosystem.app.n8n.cloud/webhook/3699f7aa-54e0-46d5-b50d-eda395016cae/chats/",SESSION_DETAILS_PREFIX:"https://komodosystem.app.n8n.cloud/webhook/ce280f5d-d4f8-403a-ae82-95a2f18fc6d4/chats/"},p={NEWEST:"newest",OLDEST:"oldest",HIGHEST_SUCCESS:"highest_success",LOWEST_SUCCESS:"lowest_success"},_=async(e,t={})=>{const s={...t.headers,Authorization:M,"Content-Type":"application/json"},r={...t,headers:s};try{const a=await fetch(e,r);if(!a.ok){let u="Request failed";try{u=await a.text()}catch{}throw new Error(`API Error: ${a.status} ${a.statusText}. ${u}`)}const d=await a.text();return d?JSON.parse(d):{}}catch(a){throw console.error(`Fetch error for ${e}:`,a),a}},B=async()=>_(E.CHATS_LIST),O=async(e,t=1,s=12,r=p.HIGHEST_SUCCESS)=>{const a=`${E.CHAT_SESSIONS_PREFIX}${e}?page=${t}&per_page=${s}&sort=${r}`;return _(a)},U=async(e,t)=>{const s=`${E.SESSION_DETAILS_PREFIX}${e}/session/${t}`;return _(s)},N=document.getElementById("root");let b=[],c=[],w=!0,g=!1,m="",o=null,h=null,i=null,y=!1,x=null,n=1,l=1,v=p.HIGHEST_SUCCESS;const F=e=>{if(!e)return"Date N/A";const t=new Date(e);return isNaN(t.getTime())?"Invalid Date":t.toLocaleString([],{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})},k=e=>{if(e==null)return{barColor:"bg-slate-300",textColor:"text-slate-500",label:"Analysis N/A",potential:"N/A"};const t=parseInt(e,10);return isNaN(t)?{barColor:"bg-slate-300",textColor:"text-slate-500",label:"Invalid Data",potential:"Error"}:t>=70?{barColor:"bg-green-500",textColor:"text-green-700",label:"High Success",potential:t}:t>=40?{barColor:"bg-yellow-400",textColor:"text-yellow-700",label:"Medium Success",potential:t}:{barColor:"bg-red-500",textColor:"text-red-700",label:"Low Success",potential:t}},I=(e="md",t="text-green-600")=>`
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
              <h1 class="text-2xl font-semibold text-slate-700">Sales Leads Dashboard ${m?`- ${m}`:""}</h1>
            </div>
            <div class="flex items-center space-x-2 text-green-700">
                <span class="material-symbols-outlined">battery_charging_full</span>
                <span class="font-medium">BatteryEVO</span>
            </div>
          </div>
        </header>
      `,G=()=>b.length===0&&!w?"":`
        <div class="mb-6 p-4 bg-white rounded-lg shadow">
          <label for="chat-select" class="block text-sm font-medium text-slate-700 mb-2">
            Select ChatBot:
          </label>
          <div class="relative w-full sm:w-auto control-select-wrapper">
            <select id="chat-select" class="block w-full appearance-none rounded-md border border-slate-300 bg-white py-2.5 pl-3 pr-10 text-base text-slate-700 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm">
              <option value="" disabled ${o?"":"selected"}>Select a ChatBot...</option>
              ${b.map(e=>`
                <option value="${e.chat_id}" ${o===e.chat_id?"selected":""}>
                  ${e.chat_name}
                </option>
              `).join("")}
            </select>
            <span class="material-symbols-outlined text-xl text-slate-500">expand_more</span>
          </div>
        </div>
      `,R=()=>o?`
        <div class="mb-6 flex flex-col sm:flex-row justify-between items-center p-4 bg-white rounded-lg shadow">
          <label for="sort-select" class="block text-sm font-medium text-slate-700 mb-2 sm:mb-0 sm:mr-3">
            Sort by:
          </label>
          <div class="relative w-full sm:w-auto control-select-wrapper">
            <select id="sort-select" class="block w-full appearance-none rounded-md border border-slate-300 bg-white py-2.5 pl-3 pr-10 text-base text-slate-700 shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 sm:text-sm">
              ${[{value:p.HIGHEST_SUCCESS,label:"Highest Success"},{value:p.LOWEST_SUCCESS,label:"Lowest Success"},{value:p.NEWEST,label:"Newest First (Last Updated)"},{value:p.OLDEST,label:"Oldest First (Last Updated)"}].map(t=>`
                <option value="${t.value}" ${v===t.value?"selected":""}>
                  ${t.label}
                </option>
              `).join("")}
            </select>
            <span class="material-symbols-outlined text-xl text-slate-500">expand_more</span>
          </div>
        </div>
      `:"",W=e=>{const{barColor:t,textColor:s,label:r,potential:a}=k(e.ai_success_eval),d=F(e.last_updated),u=e.ai_summary||"Summary not available.";let S="ID N/A",C="Session ID Not Available";return e&&typeof e.session_id=="string"&&e.session_id.length>0&&(C=e.session_id,S=e.session_id.length>12?e.session_id.substring(0,12)+"...":e.session_id),`
        <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
          <div class="p-5 flex-grow">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h3 class="text-lg font-semibold text-slate-800 leading-tight truncate" title="Session ID: ${C}">
                  Session ID: ${S}
                </h3>
                <p class="text-xs text-slate-500">${d}</p>
              </div>
            </div>
    
            <div class="mb-3">
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-medium ${s}">${r}</span>
                <span class="text-xl font-bold ${s}">${a}${a!=="N/A"&&a!=="Error"?"%":""}</span>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-2.5">
                <div 
                  class="${t} h-2.5 rounded-full transition-all duration-500 ease-out" 
                  style="width: ${a!=="N/A"&&a!=="Error"?a:0}%;"
                ></div>
              </div>
            </div>
            <p class="text-sm text-slate-600 italic line-clamp-2" title="${u}">
              "${u}"
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
      `},V=e=>o?g?`<div class="flex justify-center py-10">${I("md")} <span class="ml-2 text-slate-600">Loading sessions for ${m}...</span></div>`:e.length===0?`<p class="text-center text-slate-500 py-8 text-lg">No chat sessions found for ${m}.</p>`:`
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${e.map(t=>W(t)).join("")}
        </div>
      `:'<p class="text-center text-slate-500 py-8 text-lg">Select a ChatBot from the dropdown to view its sessions.</p>',X=()=>{if(!o||l<=1||g)return"";const e=[],t=5;let s=Math.max(1,n-Math.floor(t/2)),r=Math.min(l,s+t-1);r-s+1<t&&(s=Math.max(1,r-t+1));for(let a=s;a<=r;a++)e.push(a);return`
        <nav class="flex justify-center items-center space-x-2 mt-8 mb-4" aria-label="Pagination">
          <button
            data-page="${Math.max(1,n-1)}"
            ${n===1?"disabled":""}
            class="page-btn px-3 py-2 text-slate-600 bg-white rounded-md shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span class="material-symbols-outlined text-xl align-middle">chevron_left</span>
          </button>
    
          ${s>1?`
            <button data-page="1" class="page-btn px-4 py-2 text-slate-600 bg-white rounded-md shadow-sm hover:bg-slate-50 transition-colors">1</button>
            ${s>2?'<span class="text-slate-500">...</span>':""}
          `:""}
    
          ${e.map(a=>`
            <button
              data-page="${a}"
              class="page-btn px-4 py-2 rounded-md shadow-sm transition-colors ${n===a?"bg-green-600 text-white font-medium":"bg-white text-slate-600 hover:bg-slate-50"}"
            >
              ${a}
            </button>
          `).join("")}
    
          ${r<l?`
            ${r<l-1?'<span class="text-slate-500">...</span>':""}
            <button data-page="${l}" class="page-btn px-4 py-2 text-slate-600 bg-white rounded-md shadow-sm hover:bg-slate-50 transition-colors">${l}</button>
          `:""}
    
          <button
            data-page="${Math.min(l,n+1)}"
            ${n===l?"disabled":""}
            class="page-btn px-3 py-2 text-slate-600 bg-white rounded-md shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span class="material-symbols-outlined text-xl align-middle">chevron_right</span>
          </button>
        </nav>
      `},q=()=>{if(!i)return"";const e=d=>{const u=d.message_type==="human",S=u?"bg-green-500 text-white self-end rounded-l-lg rounded-br-lg":"bg-slate-200 text-slate-800 self-start rounded-r-lg rounded-bl-lg",C=new Date(d.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});return`
          <div class="flex flex-col mb-3 ${u?"items-end":"items-start"}">
            <div class="max-w-xs md:max-w-md lg:max-w-lg p-3 shadow ${S}">
              <p class="text-sm whitespace-pre-wrap">${d.message}</p>
            </div>
            <span class="text-xs mt-1 ${u?"text-slate-400 mr-1":"text-slate-400 ml-1"}">
              ${C}
            </span>
          </div>
        `};let t="";y?t=`<div class="flex justify-center items-center h-full">${I("md","text-slate-500")} <span class="ml-2 text-slate-500">Loading messages...</span></div>`:x?t=`<p class="text-red-600 text-center">${x}</p>`:i.messages&&i.messages.length>0?t=i.messages.map(d=>e(d)).join(""):t='<p class="text-slate-500 text-center">No messages in this session.</p>';const{potential:s}=k(i.ai_success_eval),r=i.ai_summary||"Summary not available.";return`
        <div class="modal-content" role="document">
          <div class="flex justify-between items-center p-5 border-b border-slate-200">
            <h2 id="modal-title" class="text-xl font-semibold text-slate-700 truncate">Chat Session: ${i&&i.session_id?i.session_id:"N/A"}</h2>
            <button id="close-modal-btn" class="text-slate-400 hover:text-slate-600 transition-colors" aria-label="Close modal">
              <span class="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>
          
          <div class="p-5 flex-grow overflow-y-auto space-y-2 bg-slate-50 min-h-[200px]">
            ${t}
          </div>
    
          <div class="p-5 border-t border-slate-200 bg-white">
            <h3 class="text-md font-semibold text-slate-700 mb-1">Session Analysis:</h3>
            <p class="text-2xl font-bold text-green-600 mb-1">${s}${s!=="N/A"&&s!=="Error"?"%":""} Success</p>
            <p class="text-sm text-slate-600 italic">"${r}"</p>
          </div>
          <div class="p-3 bg-slate-100 text-right">
              <button id="close-modal-footer-btn" class="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 text-sm">
                  Close
              </button>
          </div>
        </div>
      `},$=()=>{let e=document.getElementById("chat-modal");if(!i){e&&e.classList.remove("active");return}e||(e=document.createElement("div"),e.id="chat-modal",e.className="modal",e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-labelledby","modal-title"),document.body.appendChild(e),e.addEventListener("click",r=>{r.target.id==="chat-modal"&&L()})),e.innerHTML=q(),e.classList.add("active");const t=e.querySelector("#close-modal-btn");t&&t.addEventListener("click",L);const s=e.querySelector("#close-modal-footer-btn");s&&s.addEventListener("click",L),t&&t.focus()},f=()=>{if(!N)return;let e="";w?e=`
          <div class="min-h-screen flex flex-col items-center justify-center text-slate-700">
            ${I("lg")}
            <p class="mt-4 text-lg">Loading dashboard configuration...</p>
          </div>
        `:e=`
          ${z()}
          <main class="container mx-auto px-4 py-8 md:px-6 md:py-12">
            ${h?`
              <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                <strong class="font-bold">Error:</strong>
                <span class="block sm:inline"> ${h}</span>
              </div>
            `:""}
            ${G()}
            ${o?R():""}
            
            ${V(c)}
    
            ${o&&l>1&&!g?X():""}
          </main>
          <footer class="py-6 text-center text-sm text-slate-500">
            Sales Dashboard
          </footer>
        `,N.innerHTML=e,$(),Q()},A=async()=>{if(!o){c=[],l=1,g=!1,f();return}g=!0,h=null,c=[],f();try{const e=await O(o,n,12,v);c=e.sessions||[],l=e.num_pages||1,n>l&&l>0?n=l:l===0&&(n=1)}catch(e){console.error(`Error fetching sessions for chat ${o}:`,e),h=`Failed to load chat sessions for ${m}: ${e.message}.`,c=[],l=1}finally{g=!1,f()}},K=async e=>{if(!e||!o){console.warn("Attempted to select session with invalid ID or no current chat selected.");return}const t=c.find(s=>s.session_id===e);if(t){i={...t,messages:[]},y=!0,x=null,$();try{const s=await U(o,e);i.messages=s.chat_log||[]}catch(s){console.error(`Error fetching details for session ${e}:`,s),x=`Failed to load messages: ${s.message}`,i.messages=[]}finally{y=!1,$()}}},L=()=>{i=null,y=!1,x=null,$()},Z=e=>{const t=parseInt(e,10);o&&!isNaN(t)&&t!==n&&t>0&&t<=l&&(n=t,A())},J=e=>{o&&e!==v&&(v=e,n=1,A())},Y=e=>{if(!e){o=null,m="",c=[],l=1,n=1,h=null,f();return}const t=b.find(s=>s.chat_id===e);t&&(o=t.chat_id,m=t.chat_name,n=1,v=p.HIGHEST_SUCCESS,c=[],A())},Q=()=>{const e=document.getElementById("chat-select");e&&(e.removeEventListener("change",P),e.addEventListener("change",P));const t=document.getElementById("sort-select");t&&(t.removeEventListener("change",D),t.addEventListener("change",D)),document.querySelectorAll(".view-chat-btn").forEach(s=>{s.removeEventListener("click",j),s.addEventListener("click",j)}),document.querySelectorAll(".page-btn").forEach(s=>{s.removeEventListener("click",H),s.addEventListener("click",H)})};function P(e){Y(e.target.value)}function D(e){J(e.target.value)}function j(e){const t=e.currentTarget;t&&t.dataset&&t.dataset.sessionId?K(t.dataset.sessionId):console.warn("View chat button clicked without a session ID or button/dataset is undefined.")}function H(e){const t=e.currentTarget;!t.disabled&&t.dataset&&Z(t.dataset.page)}const ee=async()=>{w=!0,h=null,o=null,m="",c=[],b=[],f();try{const e=await B();e.chats&&e.chats.length>0?b=e.chats:(h="No ChatBots available from the API. Please check configuration or API status.",b=[])}catch(e){console.error("Failed to load initial chat data (available chats):",e),h=`Failed to initialize dashboard (could not load ChatBots): ${e.message}.`,b=[]}finally{w=!1,f()}};document.addEventListener("DOMContentLoaded",()=>{ee()})}
