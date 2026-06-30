import{n as e,r as t,t as n}from"./supabase-lAUM1H43.js";t((()=>{n();function t(e){let t=document.querySelector(e);if(!t)throw Error(`Element ${e} not found`);return t}var r=t(`#login-section`),i=t(`#dashboard-section`),a=t(`#admin-login-form`),o=t(`#login-error`),s=t(`#btn-logout`);async function c(){let{data:{session:t}}=await e.auth.getSession();t?(r.classList.add(`hidden`),i.classList.remove(`hidden`),d(`messages`)):(r.classList.remove(`hidden`),i.classList.add(`hidden`))}a.addEventListener(`submit`,async n=>{n.preventDefault();let r=t(`#login-email`).value,i=t(`#login-password`).value,a=t(`#btn-login`),s=a.querySelector(`span`);s&&(s.textContent=`Logging in...`),a.disabled=!0;let{error:l}=await e.auth.signInWithPassword({email:r,password:i});l?(o.textContent=`Sai tài khoản hoặc mật khẩu!`,s&&(s.textContent=`Login`),a.disabled=!1):(o.textContent=``,c())}),s.addEventListener(`click`,async()=>{await e.auth.signOut(),window.location.reload()});var l=document.querySelectorAll(`.nav-btn`),u=document.querySelectorAll(`.tab-pane`);l.forEach(e=>{e.addEventListener(`click`,e=>{let t=e.currentTarget,n=t.dataset.tab;l.forEach(e=>e.classList.remove(`active`)),t.classList.add(`active`),u.forEach(e=>{e.id===`tab-${n}`?e.classList.remove(`hidden`):e.classList.add(`hidden`)}),n&&d(n)})});async function d(e){e===`messages`&&await f(),e===`projects`&&await p(),e===`ctfs`&&await m(),e===`skills`&&await h(),e===`education`&&await g(),e===`activities`&&await _(),e===`platforms`&&await v(),e===`settings`&&await b()}async function f(){let n=t(`#messages-tbody`),{data:r,error:i}=await e.from(`messages`).select(`*`).order(`created_at`,{ascending:!1});if(i||!r){n.innerHTML=`<tr><td colspan="6">Error loading messages</td></tr>`;return}if(r.length===0){n.innerHTML=`<tr><td colspan="6">No messages found.</td></tr>`;return}window.messagesData=r,n.innerHTML=r.map(e=>{let t=`-`,n=e.message||``;if(n.startsWith(`Subject: `)){let e=n.indexOf(`

`);e!==-1&&(t=n.substring(9,e),n=n.substring(e+2))}let r=t.replace(/</g,`&lt;`),i=n.length>50?n.substring(0,50).replace(/</g,`&lt;`)+`...`:n.replace(/</g,`&lt;`),a=(e.name||``).replace(/</g,`&lt;`).replace(/>/g,`&gt;`),o=(e.email||``).replace(/</g,`&lt;`).replace(/>/g,`&gt;`);return`
        <tr>
          <td>${new Date(e.created_at).toLocaleDateString()}</td>
          <td>${a}</td>
          <td>${o}</td>
          <td>${r}</td>
          <td>${i}</td>
          <td>
            <button class="action-btn" onclick="readMessage('${e.id}')">Read</button>
            <button class="action-btn delete" onclick="deleteRecord('messages', '${e.id}')">Delete</button>
          </td>
        </tr>
      `}).join(``)}async function p(){let n=t(`#projects-tbody`),{data:r,error:i}=await e.from(`projects`).select(`*`).order(`created_at`,{ascending:!1});if(i||!r){n.innerHTML=`<tr><td colspan="4">Error loading projects</td></tr>`;return}n.innerHTML=r.map(e=>`
    <tr>
      <td>${e.title}</td>
      <td>${e.category||`-`}</td>
      <td>${e.tags?e.tags.join(`, `):`-`}</td>
      <td>
        <button class="action-btn" onclick="editRecord('project', '${e.id}')">Edit</button>
        <button class="action-btn delete" onclick="deleteRecord('projects', '${e.id}')">Delete</button>
      </td>
    </tr>
  `).join(``)}async function m(){let n=t(`#ctfs-tbody`),{data:r,error:i}=await e.from(`ctfs`).select(`*`).order(`year`,{ascending:!1});i||!r||(n.innerHTML=r.map(e=>`
    <tr>
      <td>${e.name}</td>
      <td>${e.rank||`-`}</td>
      <td>${e.year||`-`}</td>
      <td>
        <button class="action-btn" onclick="editRecord('ctf', '${e.id}')">Edit</button>
        <button class="action-btn delete" onclick="deleteRecord('ctfs', '${e.id}')">Delete</button>
      </td>
    </tr>
  `).join(``))}async function h(){let n=t(`#skills-tbody`),{data:r,error:i}=await e.from(`skills`).select(`*`);if(i||!r)return;let a={frontend:`Programming`,backend:`Security Tools`,tools:`OS & Platforms`};n.innerHTML=r.map(e=>`
    <tr>
      <td>${e.name}</td>
      <td>${e.level}%</td>
      <td>${a[e.category]||e.category}</td>
      <td>
        <button class="action-btn" onclick="editRecord('skill', '${e.id}')">Edit</button>
        <button class="action-btn delete" onclick="deleteRecord('skills', '${e.id}')">Delete</button>
      </td>
    </tr>
  `).join(``)}async function g(){let n=t(`#education-tbody`),{data:r,error:i}=await e.from(`education`).select(`*`).order(`order_idx`,{ascending:!0});if(i){console.error(`Error loading education:`,i),n.innerHTML=`<tr><td colspan="4">Error loading data. Check console.</td></tr>`;return}if(!r||r.length===0){n.innerHTML=`<tr><td colspan="4">No education records found.</td></tr>`;return}n.innerHTML=r.map(e=>`
    <tr>
      <td>${e.role}</td>
      <td>${e.institution}</td>
      <td>${e.start_date} - ${e.end_date}</td>
      <td>
        <button class="action-btn" onclick="editRecord('education', '${e.id}')">Edit</button>
        <button class="action-btn delete" onclick="deleteRecord('education', '${e.id}')">Delete</button>
      </td>
    </tr>
  `).join(``)}async function _(){let n=t(`#activities-tbody`),{data:r,error:i}=await e.from(`activities`).select(`*`).order(`order_idx`,{ascending:!0});if(i){console.error(`Error loading activities:`,i),n.innerHTML=`<tr><td colspan="4">Error loading data. Check console.</td></tr>`;return}if(!r||r.length===0){n.innerHTML=`<tr><td colspan="4">No activity records found.</td></tr>`;return}n.innerHTML=r.map(e=>`
    <tr>
      <td>${e.role}</td>
      <td>${e.organization}</td>
      <td>${e.start_date} - ${e.end_date}</td>
      <td>
        <button class="action-btn" onclick="editRecord('activity', '${e.id}')">Edit</button>
        <button class="action-btn delete" onclick="deleteRecord('activities', '${e.id}')">Delete</button>
      </td>
    </tr>
  `).join(``)}async function v(){let n=t(`#platforms-tbody`),{data:r,error:i}=await e.from(`platforms`).select(`*`).order(`order_idx`,{ascending:!0});if(i){console.error(`Error loading platforms:`,i),n.innerHTML=`<tr><td colspan="4">Error loading data. Check console.</td></tr>`;return}if(!r||r.length===0){n.innerHTML=`<tr><td colspan="4">No platform records found.</td></tr>`;return}n.innerHTML=r.map(e=>`
    <tr>
      <td>${e.name}</td>
      <td>${e.link_url}</td>
      <td>${e.order_idx||0}</td>
      <td>
        <button class="action-btn" onclick="editRecord('platform', '${e.id}')">Edit</button>
        <button class="action-btn delete" onclick="deleteRecord('platforms', '${e.id}')">Delete</button>
      </td>
    </tr>
  `).join(``)}var y=null;async function b(){let{data:n,error:r}=await e.from(`settings`).select(`*`).limit(1);!r&&n&&n.length>0&&(y=n[0].id,t(`#setting-hero-title`).value=n[0].hero_title||``,t(`#setting-hero-subtitle`).value=n[0].hero_subtitle||``,t(`#setting-stat-ctf`).value=n[0].stat_ctf||``,t(`#setting-stat-languages`).value=n[0].stat_languages||``,t(`#setting-stat-platforms`).value=n[0].stat_platforms||``,t(`#setting-about`).value=n[0].about_text||``,t(`#setting-gpa`).value=n[0].gpa||``,t(`#setting-location`).value=n[0].location||``,t(`#setting-email`).value=n[0].email||``,t(`#setting-phone`).value=n[0].phone||``,t(`#setting-github-url`).value=n[0].github_url||``,t(`#setting-linkedin-url`).value=n[0].linkedin_url||``,t(`#setting-facebook-url`).value=n[0].facebook_url||``,t(`#setting-instagram-url`).value=n[0].instagram_url||``,setTimeout(()=>{document.querySelectorAll(`textarea`).forEach(e=>x(e))},50))}function x(e){e.style.height=`auto`,e.style.height=e.scrollHeight+3+`px`}document.addEventListener(`input`,e=>{let t=e.target;t.tagName.toLowerCase()===`textarea`&&x(t)}),t(`#btn-save-settings`)?.addEventListener(`click`,async n=>{n.preventDefault();let r=n.target;r.textContent=`Saving...`;let i={hero_title:t(`#setting-hero-title`).value,hero_subtitle:t(`#setting-hero-subtitle`).value,stat_ctf:t(`#setting-stat-ctf`).value,stat_languages:t(`#setting-stat-languages`).value,stat_platforms:t(`#setting-stat-platforms`).value,about_text:t(`#setting-about`).value,gpa:t(`#setting-gpa`).value,location:t(`#setting-location`).value,email:t(`#setting-email`).value,phone:t(`#setting-phone`).value,github_url:t(`#setting-github-url`).value,linkedin_url:t(`#setting-linkedin-url`).value,facebook_url:t(`#setting-facebook-url`).value,instagram_url:t(`#setting-instagram-url`).value};if(y)await e.from(`settings`).update(i).eq(`id`,y);else{let{data:t}=await e.from(`settings`).insert([i]).select();t&&t.length>0&&(y=t[0].id)}r.textContent=`Saved!`,setTimeout(()=>r.textContent=`Save Settings`,2e3)}),t(`#btn-refresh-messages`).addEventListener(`click`,f);var S=t(`#crud-modal`),C=t(`#crud-form`),w=t(`#modal-title`),T=t(`#modal-fields`),E=t(`#btn-modal-close`),D=t(`#btn-modal-cancel`),O={table:``,id:null},k={project:[{name:`title`,label:`Title`,type:`text`,required:!0},{name:`category`,label:`Category`,type:`text`},{name:`tags`,label:`Tags (comma separated)`,type:`text`},{name:`description`,label:`Description`,type:`textarea`},{name:`github_link`,label:`GitHub Link`,type:`url`},{name:`image_url`,label:`Image URL`,type:`url`}],ctf:[{name:`name`,label:`CTF Name`,type:`text`,required:!0},{name:`rank`,label:`Rank`,type:`text`},{name:`year`,label:`Year`,type:`number`},{name:`tags`,label:`Tags (comma separated)`,type:`text`}],skill:[{name:`name`,label:`Skill Name`,type:`text`,required:!0},{name:`level`,label:`Level (%)`,type:`number`,required:!0},{name:`category`,label:`Category`,type:`select`,options:[`Programming`,`Security Tools`,`OS & Platforms`],required:!0},{name:`icon`,label:`Icon (emoji or 1-2 letters)`,type:`text`}],education:[{name:`role`,label:`Degree / Role`,type:`text`,required:!0},{name:`institution`,label:`Institution / School`,type:`text`,required:!0},{name:`start_date`,label:`Start Date (e.g. 2023)`,type:`text`},{name:`end_date`,label:`End Date (e.g. 2027 or Present)`,type:`text`},{name:`description`,label:`Description`,type:`textarea`},{name:`tags`,label:`Tags (comma separated)`,type:`text`},{name:`order_idx`,label:`Order Index`,type:`number`}],activity:[{name:`role`,label:`Role / Award`,type:`text`,required:!0},{name:`organization`,label:`Organization`,type:`text`,required:!0},{name:`start_date`,label:`Start Date (e.g. 2024)`,type:`text`},{name:`end_date`,label:`End Date (e.g. 2025)`,type:`text`},{name:`description`,label:`Description`,type:`textarea`},{name:`tags`,label:`Tags (comma separated)`,type:`text`},{name:`order_idx`,label:`Order Index`,type:`number`}],platform:[{name:`name`,label:`Platform Name`,type:`text`,required:!0},{name:`logo_url`,label:`Logo URL`,type:`url`},{name:`link_url`,label:`Platform URL`,type:`url`},{name:`order_idx`,label:`Order Index`,type:`number`}]};function A(e,t=null,n=null){let r=e+`s`;e===`activity`?r=`activities`:e===`education`&&(r=`education`),O={table:r,id:t},w.textContent=t?`Edit ${e}`:`Add ${e}`;let i=k[e];i&&(T.innerHTML=i.map(e=>{let t=n?n[e.name]:``;if(e.name===`tags`&&Array.isArray(t)&&(t=t.join(`, `)),e.type===`textarea`)return`<div class="form-group"><label>${e.label}</label><textarea name="${e.name}" rows="4" ${e.required?`required`:``}>${t||``}</textarea></div>`;if(e.type===`select`){let n=t;t===`frontend`?n=`Programming`:t===`backend`?n=`Security Tools`:t===`tools`&&(n=`OS & Platforms`);let r=e.options.map(e=>`<option value="${e}" ${n===e?`selected`:``}>${e}</option>`).join(``);return`<div class="form-group"><label>${e.label}</label><select name="${e.name}" ${e.required?`required`:``}>${r}</select></div>`}return`<div class="form-group"><label>${e.label}</label><input type="${e.type}" name="${e.name}" value="${t||``}" ${e.required?`required`:``} /></div>`}).join(``),setTimeout(()=>{T.querySelectorAll(`textarea`).forEach(e=>x(e))},50),S.classList.remove(`hidden`))}function j(){S.classList.add(`hidden`),C.reset()}E.addEventListener(`click`,e=>{e.preventDefault(),j()}),D.addEventListener(`click`,j),C.addEventListener(`submit`,async t=>{t.preventDefault();let n=new FormData(C),r={};if(n.forEach((e,t)=>{e&&(t===`tags`?r[t]=e.split(`,`).map(e=>e.trim()):r[t]=e)}),r.category){let e={Programming:`frontend`,"Security Tools":`backend`,"OS & Platforms":`tools`};e[r.category]&&(r.category=e[r.category])}O.id?await e.from(O.table).update(r).eq(`id`,O.id):await e.from(O.table).insert([r]),j(),d(O.table)}),document.querySelectorAll(`.btn-add`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.currentTarget.dataset.type;t&&A(t)})}),window.readMessage=e=>{let t=window.messagesData;if(!t)return;let n=t.find(t=>t.id===e);if(n){let e=`None`,t=n.message||``;if(t.startsWith(`Subject: `)){let n=t.indexOf(`

`);n!==-1&&(e=t.substring(9,n),t=t.substring(n+2))}alert(`From: ${n.name} <${n.email}>\nDate: ${new Date(n.created_at).toLocaleString()}\nSubject: ${e}\n\n${t}`)}},window.deleteRecord=async(t,n)=>{confirm(`Are you sure you want to delete this item?`)&&(await e.from(t).delete().eq(`id`,n),d(t))},window.editRecord=async(t,n)=>{let r=t+`s`;t===`activity`?r=`activities`:t===`education`&&(r=`education`);let{data:i}=await e.from(r).select(`*`).eq(`id`,n).single();i&&A(t,n,i)},c()}))();