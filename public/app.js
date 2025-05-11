document.addEventListener('DOMContentLoaded', () => {
  // Theme handling
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Navigation elements
  const navLinks = document.querySelectorAll('.app-nav a');
  const landingPages = document.querySelectorAll('.landing-page');

  // Theme functions
  const setTheme = (theme) => {
    html.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    themeToggle.textContent = theme === 'light' ? '🌞' : '🌜';
    themeToggle.setAttribute('aria-label', `${theme} theme`);
  };

  // Navigation functions
  const showPage = (pageId) => {
    landingPages.forEach(page => {
      page.classList.toggle('active', page.id === pageId);
    });
    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${pageId}`;
      link.classList.toggle('active', isActive);
      link.setAttribute('aria-current', isActive ? 'page' : null);
    });
    history.pushState(null, '', `#${pageId}`);
  };

  // Helper: Insert Twitter timeline embed into a card
  function insertTwitterEmbed(card, username) {
    // Remove previous content
    card.innerHTML = '';
    // Insert Twitter timeline embed
    const embedDiv = document.createElement('div');
    embedDiv.innerHTML = `
      <a class="twitter-timeline" href="https://twitter.com/${username}?ref_src=twsrc%5Etfw">
        Tweets by @${username}
      </a>
    `;
    card.appendChild(embedDiv);

    // Load Twitter widgets.js if not already loaded
    if (!window.twttr) {
      const script = document.createElement('script');
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      window.twttr.widgets.load();
    }
  }

  // Card interactions (event delegation)
  document.body.addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    if (card) {
      const source = card.dataset.source;
      if (source === 'x') {
        const username = card.dataset.username || 'visionbynoble';
        insertTwitterEmbed(card, username);
      } else {
        card.classList.add('loading');
        setTimeout(() => {
          card.classList.remove('loading');
          alert(`Loading content from ${source}...`);
        }, 300);
      }
    }
  });

  document.body.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const card = event.target.closest('.card');
      if (card) {
        const source = card.dataset.source;
        if (source === 'x') {
          const username = card.dataset.username || 'visionbynoble';
          insertTwitterEmbed(card, username);
        } else {
          card.classList.add('loading');
          setTimeout(() => {
            card.classList.remove('loading');
            alert(`Loading content from ${source}...`);
          }, 300);
        }
      }
    }
  });

  // Theme toggle
  themeToggle.addEventListener('click', () => {
    const newTheme = html.dataset.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  });

  // Navigation
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      showPage(targetId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Initialize state
  const savedTheme = localStorage.getItem('theme') || 'light';
  const initialPage = window.location.hash.substring(1) || 'investments';
  setTheme(savedTheme);
  showPage(initialPage);

  // Handle browser navigation (back/forward)
  window.addEventListener('popstate', () => {
    const pageId = window.location.hash.substring(1) || 'investments';
    showPage(pageId);
  });
});
