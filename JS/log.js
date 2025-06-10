const MAX_AGE = 19;            // After this many increments, we'll remove the entry
    const log = document.getElementById('log');

    function addLog(message) {
      // 1) Age up all existing entries
      document.querySelectorAll('#log .log-entry').forEach(p => {
        let age = parseInt(p.dataset.age || '0', 10) + 1;
        if (age > MAX_AGE) {
          p.remove();
        } else {
          p.dataset.age = age;
          // lightness = (age / MAX_AGE) * 100%
          p.style.color = `hsl(0, 0%, ${age / MAX_AGE * 100}%)`;
        }
      });

      // 2) Create the new entry at age=0 (pure black)
      const p = document.createElement('p');
      p.className = 'log-entry';
      p.dataset.age = '0';
      p.textContent = message;
      p.style.color = 'hsl(0, 0%, 0%)';

      // 3) Insert it right below the <h3>
      const header = log.querySelector('h3');
      log.insertBefore(p, header.nextSibling);
    };