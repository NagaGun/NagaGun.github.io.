// dataRenderer.js – vanilla JS to load portfolioData.json and render sections

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const resp = await fetch('portfolioData.json');
    if (!resp.ok) throw new Error('Failed to load data');
    const data = await resp.json();
    renderHero(data.hero);
    renderExperience(data.experience);
    renderProjects(data.projects);
    renderSkills(data.skills);
    renderCertifications(data.certifications);
    renderLeadership(data.leadership);
    renderContact(data.contact);
  } catch (e) {
    console.error('Data renderer error:', e);
  }
});

function renderHero(hero) {
  const container = document.getElementById('hero');
  if (!container) return;
  const html = `
    <div class="hero-copy reveal" style="--delay: 120ms">
      <p class="eyebrow">${hero.eyebrow}</p>
      <h1><span>${hero.headline.split(' ')[0]}</span> <span>${hero.headline.split(' ')[1]}</span></h1>
      <p class="hero-text">${hero.bio}</p>
      <div class="hero-focus">
        ${hero.tags.map(t => `<span>${t}</span>`).join('\n')}
      </div>
      <div class="hero-actions">
        ${hero.buttons.map(b => `<a class="button primary" href="${b.href}">${b.text}</a>`).join('\n')}
      </div>
    </div>`;
  container.innerHTML = html;
}

function renderExperience(items) {
  const container = document.getElementById('experience');
  if (!container) return;
  const timeline = document.createElement('div');
  timeline.className = 'timeline-shell reveal';
  const inner = document.createElement('div');
  inner.className = 'timeline';
  inner.id = 'experienceTimeline';
  inner.setAttribute('tabindex', '0');
  inner.setAttribute('aria-label', 'Horizontal experience timeline');
  items.forEach(item => {
    const article = document.createElement('article');
    article.className = 'timeline-item';
    article.innerHTML = `
      <span class="timeline-date">${item.date}</span>
      <h3>${item.role}</h3>
      <p class="meta">${item.organization}</p>
      <p>${item.description}</p>`;
    inner.appendChild(article);
  });
  timeline.appendChild(inner);
  container.appendChild(timeline);
}

function renderProjects(projects) {
  const container = document.getElementById('projects');
  if (!container) return;
  const grid = document.createElement('div');
  grid.className = 'project-grid';
  projects.forEach(p => {
    const article = document.createElement('article');
    article.className = 'project-card reveal tilt-card';
    article.innerHTML = `
      <span class="project-tag">${p.tag}</span>
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="chip-row" aria-label="Project technologies">
        ${p.technologies.map(t => `<span>${t}</span>`).join('\n')}
      </div>`;
    grid.appendChild(article);
  });
  container.appendChild(grid);
}

function renderSkills(skills) {
  const container = document.getElementById('skills');
  if (!container) return;
  const layout = document.createElement('div');
  layout.className = 'skills-layout reveal';
  // Languages
  const langPanel = document.createElement('div');
  langPanel.className = 'skill-panel';
  langPanel.innerHTML = `<h3>Languages & Data</h3><div class="skill-cloud">${skills.languages.map(l => `<span>${l}</span>`).join('')}</div>`;
  layout.appendChild(langPanel);
  // Frameworks
  const fwPanel = document.createElement('div');
  fwPanel.className = 'skill-panel';
  fwPanel.innerHTML = `<h3>Frameworks</h3><div class="skill-cloud">${skills.frameworks.map(f => `<span>${f}</span>`).join('')}</div>`;
  layout.appendChild(fwPanel);
  // Platforms
  const plPanel = document.createElement('div');
  plPanel.className = 'skill-panel';
  plPanel.innerHTML = `<h3>Platforms & Design</h3><div class="skill-cloud">${skills.platforms.map(p => `<span>${p}</span>`).join('')}</div>`;
  layout.appendChild(plPanel);
  container.appendChild(layout);
}

function renderCertifications(certs) {
  const container = document.getElementById('certifications');
  if (!container) return;
  const grid = document.createElement('div');
  grid.className = 'credential-grid';
  certs.forEach(c => {
    const card = document.createElement('article');
    card.className = 'credential-card';
    card.innerHTML = `
      <span class="credential-year">${c.year}</span>
      <h3>${c.title}</h3>
      <p>${c.description}</p>`;
    grid.appendChild(card);
  });
  container.appendChild(grid);
}

function renderLeadership(roles) {
  const container = document.getElementById('leadership');
  if (!container) return;
  const grid = document.createElement('div');
  grid.className = 'leadership-grid';
  roles.forEach(r => {
    const card = document.createElement('article');
    card.className = 'leadership-card reveal';
    card.innerHTML = `
      <div>
        <span class="timeline-date">${r.date}</span>
        <h3>${r.role}</h3>
        ${r.organization ? `<p class="meta">${r.organization}</p>` : ''}
      </div>
      <p>${r.description}</p>`;
    grid.appendChild(card);
  });
  container.appendChild(grid);
}

function renderContact(contact) {
  const container = document.getElementById('contact');
  if (!container) return;
  const html = `
    <div class="contact-panel reveal">
      <p class="eyebrow">Contact</p>
      <h2>Let's build something thoughtful.</h2>
      <p>I am open to software engineering, cloud, AI, and product-focused opportunities.</p>
      <div class="contact-links">
        <a href="mailto:${contact.email}">${contact.email}</a>
        <a href="tel:${contact.phone.replace(/[^0-9]/g, '')}">${contact.phone}</a>
        <a href="${contact.linkedin}">LinkedIn</a>
        <a href="${contact.github}">GitHub</a>
      </div>
    </div>`;
  container.innerHTML = html;
}
