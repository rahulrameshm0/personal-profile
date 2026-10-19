(() => {
  const layers = {
    interface: {
      stack: 'HTML / CSS / JavaScript / React',
      name: 'The part people make their own.',
      description: 'Responsive pages, login flows, and product interfaces that connect people to the application.',
      label: 'Explore my Omni Food interface',
      url: 'https://github.com/rahulrameshm0/Omni-food.git',
    },
    backend: {
      stack: 'Python / Django / FastAPI',
      name: 'The engine behind the interface.',
      description: 'Authentication, application logic, and APIs that connect the frontend to useful workflows.',
      label: 'Explore my Django REST API',
      url: 'https://github.com/rahulrameshm0/DRF.git',
    },
    data: {
      stack: 'PostgreSQL / SQLite / Django ORM',
      name: 'A place for every piece of data.',
      description: 'Database-driven applications for products, profiles, messages, and inventory, with relationships that keep information organized.',
      label: 'Explore my Mini LinkedIn project',
      url: 'https://github.com/rahulrameshm0/mini-linkedin.git',
    },
    automation: {
      stack: 'Playwright / Selenium / Scrapy / BeautifulSoup',
      name: 'Less repetition. More useful work.',
      description: 'Browser workflows and web scraping that turn manual data collection into repeatable Python tasks.',
      label: 'Explore my Python automation',
      url: 'https://github.com/rahulrameshm0/Python-Automation.git',
    },
  };
  const layerButtons = document.querySelectorAll('[data-layer]');
  layerButtons.forEach(button => {
    button.addEventListener('click', () => {
      const layer = layers[button.dataset.layer];
      if (!layer) return;
      layerButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      document.querySelector('#toolkit-stack').textContent = layer.stack;
      document.querySelector('#toolkit-name').textContent = layer.name;
      document.querySelector('#toolkit-description').textContent = layer.description;
      const link = document.querySelector('#toolkit-link');
      link.textContent = layer.label;
      link.href = layer.url;
    });
  });

  const explorer = document.querySelector('.work-explorer');
  if (!explorer) return;
  const search = document.querySelector('#work-search');
  const filters = explorer.querySelectorAll('[data-work-filter]');
  const projects = Array.from(document.querySelectorAll('[data-work-category]')).map(element => ({
    element,
    category: element.dataset.workCategory,
    text: element.textContent.toLocaleLowerCase(),
  }));
  let category = 'all';
  const update = () => {
    const words = search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let count = 0;
    projects.forEach(project => {
      const matches = (category === 'all' || project.category === category) && words.every(word => project.text.includes(word));
      project.element.hidden = !matches;
      if (matches) count++;
    });
    document.querySelector('#work-results').textContent = `${count} of ${projects.length} featured projects`;
    document.querySelector('#work-empty').hidden = count > 0;
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.workFilter === category)));
  };
  search.addEventListener('input', update);
  filters.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.workFilter;
    update();
  }));
  document.querySelector('#work-reset').addEventListener('click', () => {
    search.value = '';
    category = 'all';
    update();
    search.focus();
  });
  update();
  explorer.hidden = false;
})();
