async function checkServerStatus() {
  const serverName = document.getElementById('serverName').value;
  const apiUrl = `https://api.mcsrvstat.us/2/${serverName}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.online) {
      let serverData = {
        name: serverName,
        image: data.icon ? data.icon : 'https://via.placeholder.com/150',
        playersOnline: data.players.online ? data.players.online : 0,
        status: 'online'
      };

      // Check if the country/region information is available in the API response
      if (data.country) {
        serverData = {
          ...serverData,
          region: data.country
        };
      } else {
        serverData = {
          ...serverData,
          region: 'Unavailable'
        };
      }

      // Additional server information from the API response
      if (data.hostname) {
        serverData = {
          ...serverData,
          serverIP: data.ip ? data.ip : 'Unknown',
          description: data.motd ? data.motd.clean.join('<br>') : 'No description available',
          version: data.version ? data.version : 'Unknown',
          playerList: data.players.list ? data.players.list : [],
          uptime: data.duration ? formatUptime(data.duration) : 'Unknown'
        };
      }

      displayServerStatus(serverData);
    } else {
      const serverData = {
        name: serverName,
        image: 'https://via.placeholder.com/150',
        playersOnline: 0,
        region: 'Unknown',
        status: 'offline'
      };

      displayServerStatus(serverData);
    }
  } catch (error) {
    console.error('Error fetching server status:', error);
    const serverData = {
      name: serverName,
      image: 'https://via.placeholder.com/150',
      playersOnline: 0,
      region: 'Unknown',
      status: 'error'
    };

    displayServerStatus(serverData);
  }
}

// Function to format server uptime (if available)
function formatUptime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${days}d ${hours}h ${minutes}m`;
}

function displayServerStatus(serverData) {
  const statusContainer = document.getElementById('statusContainer');
  statusContainer.innerHTML = `
    <!-- Existing server details -->
    <img src="${serverData.image}" alt="Server Image">
    <h2>${serverData.name}</h2>
    <p>Players: ${serverData.playersOnline}</p>
    <p>Status: ${serverData.status.charAt(0).toUpperCase() + serverData.status.slice(1)}</p>
    <p>Server IP: ${serverData.serverIP}</p>
    <p>Description: ${serverData.description}</p>
    <p>Version: ${serverData.version}</p>

    <!-- Favorite button -->
    <button onclick="addToFavorites('${serverData.name}')">Favorite</button>
  `;

// Trigger the fade-in animation for all elements after page load
window.addEventListener('load', () => {
  const allElements = document.querySelectorAll('*'); // Select all elements in the document

  // Apply fade-in animation to each element
  allElements.forEach(element => {
    element.classList.add('fade-in');
  });
})}

function shareServerName() {
  const serverName = document.getElementById('serverName').value;

  navigator.clipboard.writeText(serverName)
    .then(() => {
      alert('Server IP copied to clipboard: ' + serverName);
    })
    .catch(err => {
      console.error('Error copying to clipboard:', err);
    });
}

function toggleTheme() {
  const body = document.body;

  // Toggle the 'dark-mode' class on the body
  body.classList.toggle('dark-mode');
}

// Trigger the fade-in animation for center elements with a slight delay after page load
window.addEventListener('load', () => {
  setTimeout(() => {
    const centerElements = document.querySelectorAll('.container, .search-container, input[type="text"], button');
    centerElements.forEach(element => {
      element.classList.add('fade-in');
    });
  }, 100); // Adjust the delay as needed
});

function connectToServer() {
  const serverIP = document.getElementById('serverName').value.trim();

  // Open the Minecraft game with the server IP (Minecraft:// protocol)
  const protocolLink = `minecraft://${serverIP}`;
  window.open(protocolLink);
}