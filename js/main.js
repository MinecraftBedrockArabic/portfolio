const skinFiles = [
  'skin.webp',
  'skin2.webp',
  'skin3.webp'
];

const skinsPreload = skinFiles.map(file => `assets/skins/${file}`);

function applyRandomSkin() {
  const randomFile = skinFiles[Math.floor(Math.random() * skinFiles.length)];
  document.documentElement.style.setProperty('--skin-url', `url("../assets/skins/${randomFile}")`);
  return randomFile;
}

applyRandomSkin();

const sounds = {
  click: new Audio('assets/sounds/Click_stereo.ogg.ogg'),
  drawerOpen: new Audio('assets/sounds/Drawer_open.wav.ogg'),
  drawerClose: new Audio('assets/sounds/Drawer_close.wav.ogg')
};

Object.values(sounds).forEach((audio) => {
  audio.preload = 'auto';
});

let lastClickTime = 0;
let lastDrawerTime = 0;

function playSound(name, volume = 0.6) {
  try {
    const audio = sounds[name];
    if (audio) {
      const clone = audio.cloneNode();
      clone.volume = volume;
      clone.play().catch(() => { });
    }
  } catch (err) {
  }
}

function playUiClick() {
  const now = performance.now();
  if (now - lastClickTime < 100) return;
  lastClickTime = now;
  playSound('click', 0.6);
}

function playDrawerOpen() {
  const now = performance.now();
  if (now - lastDrawerTime < 150) return;
  lastDrawerTime = now;
  playSound('drawerOpen', 0.6);
}

function playDrawerClose() {
  const now = performance.now();
  if (now - lastDrawerTime < 150) return;
  lastDrawerTime = now;
  playSound('drawerClose', 0.6);
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('button, .button, .ore-world-card, .ore-tab-item, .ore-header-social, .ore-social-card, .ore-social-card-options-btn, .ore-tooltip-action-btn');
  if (btn) {
    if (btn.classList.contains('ore-header-social') || btn.classList.contains('ore-drawer-close-btn') || btn.classList.contains('close-modal') || btn.closest('.ore-world-card')) {
      return;
    }
    playUiClick();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('dragstart', (e) => {
      e.preventDefault();
      return false;
    });
    img.addEventListener('mousedown', (e) => {
      e.preventDefault();
      return false;
    });
  });
});

let isPreloaderStarted = false;

function preloadAllAssets() {
  if (isPreloaderStarted) return;
  isPreloaderStarted = true;

  const overlay = document.getElementById('screen-loading');
  const fill = document.getElementById('loading-bar-fill');
  const percentage = document.getElementById('loading-percentage');

  const minLoadingTime = 2000;
  const startTime = performance.now();

  let isFinished = false;
  let assetsLoaded = false;
  let displayedProgress = 0;

  const skyboxTextures = [
    'https://cdn.jsdelivr.net/gh/Mojang/bedrock-samples@main/resource_pack/textures/ui/panorama_0.png',
    'https://cdn.jsdelivr.net/gh/Mojang/bedrock-samples@main/resource_pack/textures/ui/panorama_1.png',
    'https://cdn.jsdelivr.net/gh/Mojang/bedrock-samples@main/resource_pack/textures/ui/panorama_2.png',
    'https://cdn.jsdelivr.net/gh/Mojang/bedrock-samples@main/resource_pack/textures/ui/panorama_3.png',
    'https://cdn.jsdelivr.net/gh/Mojang/bedrock-samples@main/resource_pack/textures/ui/panorama_4.png',
    'https://cdn.jsdelivr.net/gh/Mojang/bedrock-samples@main/resource_pack/textures/ui/panorama_5.png'
  ];

  const entityAndUiTextures = [
    ...skinsPreload,
    'https://cdn.jsdelivr.net/gh/Mojang/bedrock-samples@main/resource_pack/textures/ui/button_borderless_light.png',
    'https://cdn.jsdelivr.net/gh/Mojang/bedrock-samples@main/resource_pack/textures/ui/button_borderless_lighthover.png',
    'https://cdn.jsdelivr.net/gh/Mojang/bedrock-samples@main/resource_pack/textures/ui/button_borderless_lightpressed.png'
  ];

  const localStaticTextures = [
    'assets/logo.webp',
    'assets/banner.webp',
    'assets/addons/UltraCars_Thumbnail.webp',
    'assets/addons/arabic-language-fix-thumbnail.webp',
    'assets/addons/banner-markers-thumbnail.webp',
    'assets/addons/bit-by-bit-thumbnail.webp',
    'assets/addons/mr-gadget-thumbnail.webp',
    'assets/addons/happy-town-thumbnail.webp',
    'assets/addons/SearchLog_Thumbnail.webp',
    'assets/addons/Texture_To_Glyph.webp',
    'assets/addons/9Slice_Thumbnail.webp',
    'assets/addons/Chest_uI_Editor_Thumbnail.webp',
    'assets/addons/under-review-thumbnail.webp',
    'assets/ui/dialog_background_hollow_7.png',
    'assets/ui/seg_full.png',
    'assets/ui/seg_empty.png',
    'assets/ui/UI_Menu_WorldsTab.webp',
    'assets/ui/UI_Menu_RealmsTab.webp',
    'assets/ui/UI_Menu_ServerTab.webp',
    'assets/social-icons/discord_animation.webp',
    'assets/social-icons/16x/minecraft_icon.webp',
    'assets/social-icons/16x/discord_icon.webp',
    'assets/social-icons/16x/google_icon.webp',
    'assets/social-icons/16x/xtwitter_icon.webp',
    'assets/social-icons/16x/youtube_icon.webp',
    'assets/social-icons/16x/github_icon.webp',
    'assets/social-icons/16x/domain_icon.webp'
  ];

  const domImageSources = Array.from(document.querySelectorAll('img'))
    .map(img => img.src || img.getAttribute('src'))
    .filter(Boolean);

  const uniqueTextureUrls = Array.from(new Set([
    ...skyboxTextures,
    ...entityAndUiTextures,
    ...localStaticTextures,
    ...domImageSources
  ]));

  const fontTasks = [
    { name: 'Minecraft (Regular)', test: '16px "Minecraft"' },
    { name: 'Minecraft (Bold)', test: 'bold 16px "Minecraft"' },
    { name: 'Minecraft-Five', test: '16px "Minecraft-Five"' }
  ];

  const totalTasks = uniqueTextureUrls.length + fontTasks.length + 1;
  let completedTasks = 0;

  const onTaskDone = () => {
    completedTasks++;
    if (completedTasks >= totalTasks) {
      assetsLoaded = true;
    }
  };

  const finishLoading = () => {
    if (isFinished) return;
    isFinished = true;
    displayedProgress = 100;
    if (fill) fill.style.width = '100%';
    if (percentage) percentage.textContent = '100%';

    setTimeout(() => {
      if (overlay) {
        overlay.classList.add('fade-out');
        setTimeout(() => {
          overlay.style.display = 'none';
        }, 450);
      }
    }, 250);
  };

  function updateProgressTicker(now) {
    if (isFinished) return;

    const currentTime = now || performance.now();
    const elapsed = Math.max(0, currentTime - startTime);
    const timeRatio = Math.min(1.0, elapsed / minLoadingTime);
    const assetRatio = totalTasks > 0 ? (completedTasks / totalTasks) : 1.0;

    let targetProgress = 0;

    if (assetsLoaded) {
      targetProgress = Math.floor(timeRatio * 100);
      if (elapsed >= minLoadingTime) {
        targetProgress = 100;
      }
    } else {
      const pacingRatio = Math.min(timeRatio, assetRatio);
      targetProgress = Math.floor(pacingRatio * 90);
    }

    displayedProgress = Math.max(displayedProgress, targetProgress);

    if (fill) fill.style.width = displayedProgress + '%';
    if (percentage) percentage.textContent = displayedProgress + '%';

    if (assetsLoaded && elapsed >= minLoadingTime && displayedProgress >= 100) {
      finishLoading();
      return;
    }

    requestAnimationFrame(updateProgressTicker);
  }

  requestAnimationFrame(updateProgressTicker);

  const safetyTimer = setTimeout(() => {
    if (!isFinished) {
      console.warn('Preloader safety timeout reached. Revealing site.');
      assetsLoaded = true;
      finishLoading();
    }
  }, 15000);

  if (document.fonts) {
    fontTasks.forEach(font => {
      document.fonts.load(font.test)
        .then(() => onTaskDone())
        .catch(() => onTaskDone());
    });

    document.fonts.ready
      .then(() => onTaskDone())
      .catch(() => onTaskDone());
  } else {
    for (let i = 0; i < fontTasks.length + 1; i++) {
      onTaskDone();
    }
  }

  uniqueTextureUrls.forEach(url => {
    const img = new Image();
    let isDone = false;
    const done = () => {
      if (!isDone) {
        isDone = true;
        onTaskDone();
      }
    };

    img.onload = () => {
      if (typeof img.decode === 'function') {
        img.decode().then(done).catch(done);
      } else {
        done();
      }
    };
    img.onerror = done;
    img.src = url;

    if (img.complete) {
      if (typeof img.decode === 'function') {
        img.decode().then(done).catch(done);
      } else {
        done();
      }
    }
  });
}

const spinnerPixels = [...document.querySelectorAll(".pixel")];
const ringIndexes = [
  2, 3, 4,
  12, 20, 27, 34, 40,
  46, 45, 44,
  36, 28, 21, 14, 8
];

const filledPixelCount = ringIndexes.length / 2;
let startIndex = 0;

function updateSpinner() {
  if (!spinnerPixels.length) return;
  spinnerPixels.forEach((pixel) => {
    pixel.classList.remove("filled");
  });

  for (let offset = 0; offset < filledPixelCount; offset += 1) {
    const pixelIndex = ringIndexes[
      (startIndex + offset) % ringIndexes.length
    ];
    if (spinnerPixels[pixelIndex]) {
      spinnerPixels[pixelIndex].classList.add("filled");
    }
  }

  startIndex = (startIndex + 1) % ringIndexes.length;
}

updateSpinner();
setInterval(updateSpinner, 90);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', preloadAllAssets);
} else {
  preloadAllAssets();
}

const splashes = [
  'It works on my machine.',
  'Fix Bedrock Mojang!',
  'Mojang !Approved',
  'Probably overengineered.',
  'Works as intended',
  'Bugrock Edition',
];
const splashEl = document.getElementById('splash');

function setSplash() {
  if (splashEl) {
    splashEl.textContent = splashes[Math.floor(Math.random() * splashes.length)];
  }
}
setSplash();

const statusMessages = [
  'Playing Minecraft',
  'In Creative Mode',
  'Playing In Survival'
];

function setRandomStatus() {
  const statusEl = document.getElementById('self-status');
  if (statusEl) {
    const randomStatus = statusMessages[Math.floor(Math.random() * statusMessages.length)];
    statusEl.textContent = randomStatus;
  }
}

setRandomStatus();

const steve = document.querySelector('.steve');
const head = document.querySelector('.steve .head');
const doll = document.querySelector('.paperdoll');

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

let bodyYaw = -34;
let dragging = false;
let lastX = 0;

if (doll && steve && head) {
  doll.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastX = e.clientX;
    doll.setPointerCapture(e.pointerId);
  });
  doll.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    bodyYaw += (e.clientX - lastX) * 0.6;
    lastX = e.clientX;
    steve.style.setProperty('--yaw', bodyYaw.toFixed(1) + 'deg');
  });
  ['pointerup', 'pointercancel'].forEach((type) =>
    doll.addEventListener(type, () => { dragging = false; })
  );

  document.addEventListener('mousemove', (e) => {
    const r = doll.getBoundingClientRect();
    const headX = r.left + r.width / 2;
    const headY = r.top + r.height * 0.3;
    const desiredYaw = clamp((e.clientX - headX) / 4, -80, 80);
    const bodyNorm = ((bodyYaw % 360) + 540) % 360 - 180;
    const hy = clamp(desiredYaw - bodyNorm, -70, 70);
    const hx = clamp(-(e.clientY - headY) / 8, -30, 25);
    head.style.setProperty('--hy', hy.toFixed(1) + 'deg');
    head.style.setProperty('--hx', hx.toFixed(1) + 'deg');
  });
}

function showScreen(screenName) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(s => s.classList.remove('active'));

  if (screenName === 'main') {
    const mainScreen = document.getElementById('screen-main');
    if (mainScreen) mainScreen.classList.add('active');
  } else if (screenName === 'projects' || screenName === 'worlds') {
    const projectsScreen = document.getElementById('screen-projects');
    if (projectsScreen) projectsScreen.classList.add('active');
  }
}

function switchTab(tabId) {
  const tabButtons = document.querySelectorAll('.ore-tab-item');
  const tabContents = document.querySelectorAll('.ore-tab-pane');

  tabButtons.forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  tabContents.forEach(content => {
    if (content.id === tabId) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });
}

let isListView = false;
function toggleLayoutView() {
  isListView = !isListView;
  const gridIcon = document.getElementById('view-toggle-grid');
  const listIcon = document.getElementById('view-toggle-list');
  const containers = [
    document.getElementById('projects-container'),
    document.getElementById('tools-container'),
    document.getElementById('others-container')
  ];

  containers.forEach(c => {
    if (!c) return;
    if (isListView) {
      c.classList.remove('ore-cards-grid');
      c.classList.add('ore-cards-list');
      c.querySelectorAll('.ore-card-tags-list').forEach(el => el.style.display = 'flex');
    } else {
      c.classList.remove('ore-cards-list');
      c.classList.add('ore-cards-grid');
      c.querySelectorAll('.ore-card-tags-list').forEach(el => el.style.display = 'none');
    }
  });

  if (gridIcon && listIcon) {
    if (isListView) {
      gridIcon.style.display = 'none';
      listIcon.style.display = 'block';
    } else {
      gridIcon.style.display = 'block';
      listIcon.style.display = 'none';
    }
  }
}

const socialData = {
  'discord': {
    name: 'Discord',
    handle: 'minato4743',
    url: 'https://discord.com/users/704346785811923016',
    copyText: 'minato4743'
  },
  'email': {
    name: 'Email',
    handle: 'minatocraft2020@gmail.com',
    url: 'mailto:minatocraft2020@gmail.com',
    copyText: 'minatocraft2020@gmail.com'
  },
  'x': {
    name: 'X (Twitter)',
    handle: '@minato4743',
    url: 'https://x.com/minato4743',
    copyText: 'https://x.com/minato4743'
  },
  'youtube': {
    name: 'YouTube',
    handle: '@MinecraftBedrockArabic',
    url: 'https://www.youtube.com/@MinecraftBedrockArabic',
    copyText: 'https://www.youtube.com/@MinecraftBedrockArabic'
  },
  'github': {
    name: 'GitHub',
    handle: 'MinecraftBedrockArabic',
    url: 'https://github.com/MinecraftBedrockArabic',
    copyText: 'https://github.com/MinecraftBedrockArabic'
  },
  'discord-server': {
    name: 'Discord Server',
    handle: 'Community Server',
    url: 'https://discord.com/invite/fmTdYDv6hh',
    copyText: 'https://discord.com/invite/fmTdYDv6hh'
  },
  'website': {
    name: 'Website',
    handle: 'beyondbedrock.org',
    url: 'https://beyondbedrock.org/',
    copyText: 'https://beyondbedrock.org/'
  },
  'minato': {
    name: 'Minatocraft1',
    handle: 'Add-On Developer',
    url: 'https://github.com/MinecraftBedrockArabic',
    copyText: 'Minatocraft1'
  }
};

let activeSocialKey = 'discord';

function toggleSocialDrawer() {
  hideSocialTooltip();
  const drawer = document.getElementById('ore-social-drawer');
  const overlay = document.getElementById('ore-drawer-overlay');

  if (drawer && overlay) {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      playDrawerClose();
      drawer.classList.remove('open');
      overlay.classList.remove('active');
    } else {
      playDrawerOpen();
      drawer.classList.add('open');
      overlay.classList.add('active');
    }
  }
}

function filterSocials(query) {
  const q = query.trim().toLowerCase();
  const cards = document.querySelectorAll('#social-list-container .ore-social-card:not(.self-card)');

  cards.forEach(card => {
    const name = (card.getAttribute('data-name') || '').toLowerCase();
    const status = (card.querySelector('.ore-social-card-status')?.textContent || '').toLowerCase();
    if (!q || name.includes(q) || status.includes(q)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

function handleSocialClick(socialKey) {
  const data = socialData[socialKey];
  if (data && data.url) {
    window.open(data.url, '_blank');
  }
}

function showSocialTooltip(e, socialKey) {
  e.stopPropagation();
  activeSocialKey = socialKey;
  const data = socialData[socialKey] || socialData['discord'];
  const tooltip = document.getElementById('ore-bedrock-tooltip');
  if (!tooltip) return;

  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();

  document.getElementById('ore-tooltip-text').textContent = `${data.name} Options`;

  tooltip.style.top = `${rect.top + rect.height / 2}px`;
  tooltip.style.left = `${rect.left - 180}px`;
  tooltip.classList.add('active');
}

function hideSocialTooltip() {
  const tooltip = document.getElementById('ore-bedrock-tooltip');
  if (tooltip) tooltip.classList.remove('active');
}

function triggerTooltipAction(action) {
  const data = socialData[activeSocialKey];
  if (!data) return;

  if (action === 'open') {
    if (data.url.startsWith('mailto:')) {
      window.location.href = data.url;
    } else {
      window.open(data.url, '_blank');
    }
  } else if (action === 'copy') {
    navigator.clipboard.writeText(data.copyText).then(() => {
      const tooltipText = document.getElementById('ore-tooltip-text');
      if (tooltipText) {
        tooltipText.textContent = 'Copied to clipboard!';
        setTimeout(hideSocialTooltip, 900);
      }
    }).catch(() => {
      window.prompt('Copy handle:', data.copyText);
      hideSocialTooltip();
    });
    return;
  }
  hideSocialTooltip();
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('#ore-bedrock-tooltip') && !e.target.closest('.ore-social-card-options-btn')) {
    hideSocialTooltip();
  }
});

const projectsData = {
  'ultra-cars': {
    title: 'Ultra Cars',
    type: 'Marketplace Add-On',
    version: 'Minecraft Marketplace',
    image: 'assets/addons/UltraCars_Thumbnail.webp',
    tags: ['Marketplace', 'Add-On', 'Vehicles', 'Racing', 'Drifting', 'Multiplayer'],
    description: 'Nothing like this has ever been seen before! Hold tight and race with the fastest cars. These unique ULTRA CARS are built specifically for high-speed driving, racing and drifting. Craft your car, customize it, and show who’s the best on the track!',
    features: [
      '20 Extraordinary epic cars!',
      'Realistic drift and nitro systems',
      'Advanced driving mechanics',
      'Multiplayer friendly'
    ],
    website: 'minecraft://openStore/?showStoreOffer=c93b893e-be84-43b3-8479-5faea52b3d97',
    panorama: 'assets/panoramas/ultracars',
    contributor: null
  },
  'mr-gadget': {
    title: 'Mr. Gadget',
    type: 'World Template',
    version: 'Minecraft Marketplace',
    image: 'assets/addons/mr-gadget-thumbnail.webp',
    tags: ['World Template', 'Adventure', 'Technology', 'Gadgets'],
    description: 'Discover the high-tech inventions inside Mr. Gadget\'s crazy lab! Open up portals, grab a driller and dig passages in deep caves!',
    features: [
      'Laser-powered drone to protect you!',
      'Craftable chips to upgrade your gadgets!',
      'Hacker computer!',
      'Grappling hook and jump pad!',
      'Giant Mecha and speed car!',
      'Propeller hat and jetpack!',
      'Turrets: electric, fire, and redstone-powered!'
    ],
    website: 'minecraft://domain?showStoreOffer=d80432b0-26c0-4ea0-9895-4b1a0e8a1218',
    panorama: 'assets/panoramas/mr.gadgets'
  },
  'happy-town': {
    title: 'Happy Town',
    type: 'World Template',
    version: 'Minecraft Marketplace',
    image: 'assets/addons/happy-town-thumbnail.webp',
    tags: ['World Template', 'Roleplay', 'Pets', 'Furniture'],
    description: 'Get ready for the journey, we are heading to Happy Town! This cute town is filled with adorable pets, carefully crafted themed furniture, unique items, and fun roleplay mechanics. You can even enjoy a cozy picnic with your pet after school. Yes, really!',
    features: [
      'Custom pets and items',
      '500+ furniture variants',
      'Pet training and skill progression',
      'Music and perfect roleplay'
    ],
    website: 'minecraft://domain?showStoreOffer=b7741573-992d-4bbd-a30f-ba3c1a7fa17a',
    panorama: 'assets/panoramas/happy_town',
    contributor: 'Contributed to part of the development'
  },
  'bit-by-bit': {
    title: 'Bit By Bit Add-on',
    type: 'Script API Add-On',
    version: 'v26.4x+ Bedrock',
    image: 'assets/addons/bit-by-bit-thumbnail.webp',
    tags: ['Building', 'Blocks', 'Colors', 'Creative', 'Micro-Voxel'],
    description: 'A micro-voxel building addon that breaks down traditional blocks into 2x2x2 grids of smaller sub-units called "bits" for unprecedented creative freedom and detail. Build with 164 vanilla block variants and 64 custom color blocks.',
    features: [
      'Micro-Voxel Precision with 2x2x2 grids',
      '164 Vanilla Block Variants',
      '64 Custom Color Blocks',
      'Blueprint Tool for copying configurations',
      'Block Deconstructor for processing blocks',
      'Dynamic Light System',
      'Special Bit Properties (magma, ice, wood stripping)'
    ],
    website: 'https://beyondbedrock.org/addons/bit-by-bit',
    panorama: 'assets/panoramas/bit_by_bit',
    contributor: null
  },
  'banner-markers': {
    title: 'Banner Markers Add-on',
    type: 'Script API Add-On',
    version: 'v1.20.70+ Bedrock',
    image: 'assets/addons/banner-markers-thumbnail.webp',
    tags: ['Utility', 'Maps', 'Navigation', 'Banners', 'Script API'],
    description: 'Bring Java Edition style banner map markers and 3D in-world banner names to Minecraft Bedrock Edition. Place colored marker icons matching banner colors directly onto filled maps and display custom names above banners.',
    features: [
      'Java-Style Banner Markers on maps',
      'Custom Name Display on Maps for renamed banners',
      'In-World 3D Floating Names above banners',
      'All 16 Colors Supported',
      '100% Entity-Free & Lag-Free',
      'Automatic Cleanup when banners are removed'
    ],
    website: 'https://beyondbedrock.org/addons/banner-markers',
    panorama: 'assets/panoramas/banner_markers',
    contributor: null
  },
  'arabic-fix': {
    title: 'Arabic Language Fix Add-on',
    type: 'Script API Add-On',
    version: 'v1.21.120 Bedrock',
    image: 'assets/addons/arabic-language-fix-thumbnail.webp',
    tags: ['Utility', 'Language', 'Fix', 'Accessibility', 'Script API'],
    description: 'A simple add-on that fixes Arabic language support issues in Minecraft Bedrock Edition including chat, signs, and item names. This add-on fixes text direction and character ordering for Arabic, Persian, Urdu, Pashto, Kurdish, Sindhi, and Uyghur languages.',
    features: [
      'Fixes Arabic text direction in in-game chat',
      'Fixes entity names using nametags',
      'Fixes text on signs (Signs)',
      'Fixes item names',
      'Supports Arabic, Persian, Urdu, Pashto, Kurdish, Sindhi, and Uyghur languages'
    ],
    website: 'https://beyondbedrock.org/addons/arabic-language-fix-addon',
    panorama: 'assets/panoramas/arabic_fix',
    contributor: null
  },
  'player-heads': {
    title: 'Player Heads Generator',
    type: 'Script API Add-On',
    version: 'v1.21.90+ Bedrock',
    image: 'assets/addons/player-heads-thumbnail.webp',
    tags: ['Utility', 'Creative', 'Tools', 'Customization', 'Script API', 'Web App'],
    description: 'Easily create and manage custom player head packs for Minecraft Bedrock with 3D preview. Enter a Minecraft username and upload a skin texture to generate a ready-to-use Add-on (Resource and Behavior Pack) that you can install directly into your game or server.',
    features: [
      'Manage Add-ons effortlessly through your browser',
      'Supports all skin dimensions: standard 64x64, HD 128x128, and cropped skins',
      '3D live preview in-browser to see exactly how each head will look',
      '3D block items with correct positioning for ground, item frames, and off-hand',
      'Equippable and placeable heads - wear them or decorate your builds',
      'Player heads drop on death when killed by another entity in Survival mode',
      'Custom creative inventory category for easy access in Creative mode'
    ],
    website: 'https://beyondbedrock.org/addons/player-heads-generator',
    panorama: 'assets/panoramas/player_heads',
    contributor: null
  },

  'under-review': {
    title: 'Under Review',
    type: 'Add-On',
    version: 'v26.4x+ Bedrock',
    image: 'assets/addons/under-review-thumbnail.webp',
    tags: ['Transportation', 'Add-On'],
    description: 'Upcoming add-on currently under review for the Minecraft Marketplace.',
    features: [
      'Custom vehicles and mechanics',
      'Currently in marketplace review'
    ],
    website: '',
    contributor: null
  },

  'under-review-world': {
    title: 'Under Review',
    type: 'World Template',
    version: 'Minecraft Marketplace',
    image: 'assets/addons/under-review-thumbnail.webp',
    tags: ['World Template', 'Tools', 'Sword', 'Armors'],
    description: 'Upcoming world template currently under review for the Minecraft Marketplace.',
    features: [
      'Custom weapons and equipment',
      'Currently in marketplace review'
    ],
    website: '',
    contributor: null
  },

  'tool-searchlog': {
    title: 'SearchLog',
    type: 'Developer Web Tool',
    version: 'Web App',
    image: 'assets/addons/SearchLog_Thumbnail.webp',
    tags: ['SearchLog', 'Changelog', 'Search Engine', 'Bedrock', 'Beyond Bedrock'],
    description: 'Search in the Minecraft changelog articles across all versions with advanced filtering options.',
    features: [
      'Search articles across all Minecraft Bedrock and Java changelogs',
      'Filter by edition: Exclude Preview, Exclude Java, Exclude Bedrock',
      'Search matching options: Match Case, Match Exact, and Whole Word',
      'Sort results by Newest, Oldest, Recently Updated, or Recently Edited',
      'Direct links to official Minecraft release notes and articles'
    ],
    website: 'https://searchlog.beyondbedrock.org/',
    panorama: null
  },
  'tool-textures-to-glyph': {
    title: 'Textures to Glyph',
    type: 'Developer Web Tool',
    version: 'Web App',
    image: 'assets/addons/Texture_To_Glyph.webp',
    tags: ['Textures', 'Glyphs', 'Unicode', 'Bedrock UI', 'Atlas'],
    description: 'A tool to add vanilla or custom textures into a glyph picture/atlas so they can be used as glyphs in Minecraft Bedrock.',
    features: [
      '256-cell (16x16) atlas grid mapped to Unicode codepoints (E000+)',
      'Search and load vanilla Minecraft textures directly from Bedrock samples',
      'Upload custom PNG textures to assign to any cell in the atlas',
      'One-click copy of the corresponding Unicode symbol to clipboard',
      'Download the generated glyph sheet image (e.g. glyph_E9.png)'
    ],
    website: 'https://minato.beyondbedrock.org/web-apps/textures-to-glyph/index.html',
    panorama: null
  },
  'tool-9slice': {
    title: '9slice',
    type: 'Developer Web Tool',
    version: 'Web App',
    image: 'assets/addons/9Slice_Thumbnail.webp',
    tags: ['9slice', '9-Slice', 'JSON UI', 'Bedrock UI', 'Textures'],
    description: 'A simple 9-slice viewer for inspecting nine-slice UI assets and generating Bedrock JSON UI configurations.',
    features: [
      'Inspects and previews nine-slice UI assets with real-time scaling',
      'Generates JSON: {"nineslice_size": [2,2,2,4], "base_size": [0,0]}',
      'Adjustable margin controls for Left, Top, Right, and Bottom borders',
      'Upload custom textures to test borders with light/dark preview modes',
      'One-click button to copy the generated JSON to clipboard'
    ],
    website: 'https://minato.beyondbedrock.org/web-apps/9slice/index.html',
    panorama: null
  },
  'tool-chest-ui-editor': {
    title: 'Chest UI Editor',
    type: 'Developer Web Tool',
    version: 'Bedrock Edition',
    image: 'assets/addons/Chest_uI_Editor_Thumbnail.webp',
    tags: ['Chest UI', 'JSON UI', 'Visual Editor', 'Drag & Drop', 'Resource Pack'],
    description: 'Create and edit custom chest UIs for Minecraft Bedrock. Design interactive interfaces with drag-and-drop components.',
    features: [
      'Drag-and-drop component placement on a small chest canvas (162x54)',
      'Live in-browser editor and preview with pre-built templates',
      'Multiple Chest UIs in one project with custom trigger titles',
      'Upload custom textures for UI backgrounds and inventory slots',
      'Save and load projects in browser storage or export as resource pack ZIP'
    ],
    website: 'https://minato.beyondbedrock.org/web-apps/chest-ui-editor/index.html',
    panorama: null
  },

  'structure-summon-detector': {
    title: 'Structure Summon Detector',
    type: 'Bedrock Script API',
    version: 'Stable Script API',
    image: 'assets/addons/Structure_summon_Thumbnail.webp',
    tags: ['Script API', 'Structure Detector', 'Bedrock', 'Entity Summon', 'Pattern Detection', 'JavaScript'],
    description: 'A Minecraft Bedrock Edition script that allows you to detect specific block patterns and trigger entity summons when those patterns are completed. Similar to the method used to spawn Wither Boss, Iron Golem and Snow Golem.',
    features: [
      'Supports both 2D and 3D structure patterns',
      'Automatically handles all orientations and transformations',
      'Debug commands (/scriptevent test:place_patterns & /scriptevent test:syntax) for testing patterns',
      'Configurable block detection rate (spreads block checking over multiple ticks via job system)',
      'Pre-calculated pattern transformations for runtime efficiency',
      'Monitors block placements and executes custom summon callback functions upon pattern trigger'
    ],
    website: 'https://github.com/MinecraftBedrockArabic/Script-API-snippets/tree/main/structure%20summon%20detector',
    panorama: null,
    contributor: null
  },
  'bedrock-emoji-viewer': {
    title: 'Bedrock Emoji Viewer',
    type: 'VS Code Extension',
    version: 'v1.3.1',
    image: 'assets/addons/Emoji_Viewer_Thumbnail.webp',
    tags: ['VS Code', 'Extension', 'Bedrock', 'Glyphs', 'Unicode', 'Editor Tool'],
    description: 'A VS Code extension that displays Minecraft Bedrock custom emoji glyphs inline in your editor.',
    features: [
      'Inline Emoji Display: Automatically shows emoji images next to Unicode characters',
      'Hover Information: Hover over \\uXXXX or Unicode characters to see glyph details and a larger preview',
      'Auto-Detection: Scans for glyph_XX.png files in workspace ./font/ directories up to 3 levels deep',
      'Real-time Updates: Updates decorations and previews as you type',
      'Vanilla Emoji Fallback: Uses default glyph_E0.png and glyph_E1.png if not defined in the workspace',
      'Unicode Emoji Insertion: Press Ctrl + Shift + U after typing hex code to insert emoji or open glyph picker',
      'Configurable Settings: Options to hide source characters and ignore transparent glyphs during loading'
    ],
    website: 'https://marketplace.visualstudio.com/items?itemName=BeyondBedrock.bedrock-emoji-viewer',
    panorama: null,
    contributor: null
  }
};

let currentProjectPanorama = null;

let panoramaModalState = {
  isDragging: false,
  previousMousePosition: { x: 0, y: 0 },
  rotation: { x: -6, y: 0 },
  isAutoRotating: true
};

function openProjectModal(projectId) {
  playDrawerOpen();
  const data = projectsData[projectId] || projectsData['arabic-fix'];
  const modal = document.getElementById('ore-project-modal');
  if (!modal) return;

  document.getElementById('modal-title').textContent = data.title;
  document.getElementById('modal-name').textContent = data.title;
  document.getElementById('modal-type-version').textContent = `${data.type} • ${data.version}`;
  document.getElementById('modal-img').src = data.image;
  document.getElementById('modal-description').textContent = data.description;

  const tagsContainer = document.getElementById('modal-tags');
  tagsContainer.innerHTML = '';
  data.tags.forEach(t => {
    const pill = document.createElement('span');
    pill.className = 'ore-tag-item';
    pill.textContent = t;
    tagsContainer.appendChild(pill);
  });

  const featuresList = document.getElementById('modal-features-list');
  featuresList.innerHTML = '';
  data.features.forEach(f => {
    const li = document.createElement('li');
    li.textContent = f;
    featuresList.appendChild(li);
  });

  const btnVisit = document.getElementById('modal-btn-visit');
  if (btnVisit) {
    if (!data.website || data.website === '#') {
      btnVisit.style.display = 'none';
    } else {
      btnVisit.style.display = 'inline-block';
      btnVisit.href = data.website;
      if (data.website.startsWith('minecraft://')) {
        btnVisit.target = '_self';
        btnVisit.removeAttribute('rel');
      } else {
        btnVisit.target = '_blank';
        btnVisit.setAttribute('rel', 'noopener');
      }
    }
  }

  const btnPreview = document.getElementById('modal-btn-preview');
  if (btnPreview) {
    if (data.panorama) {
      btnPreview.style.display = 'inline-block';
      currentProjectPanorama = data.panorama;
    } else {
      btnPreview.style.display = 'none';
      currentProjectPanorama = null;
    }
  }

  const contributorBox = document.getElementById('modal-contributor-note');
  const contributorText = document.getElementById('modal-contributor-text');
  if (contributorBox) {
    if (data.contributor) {
      if (contributorText) {
        contributorText.textContent = data.contributor;
      } else {
        contributorBox.textContent = data.contributor;
      }
      contributorBox.style.display = 'flex';
    } else {
      contributorBox.style.display = 'none';
    }
  }

  modal.classList.add('show');
}

const bedrockLoadingTips = [
  "Micro-voxels in Bit By Bit break down traditional blocks into 2x2x2 sub-units.",
  "Custom vehicles in Ultra Cars feature realistic drifting and nitro mechanics!",
  "You can mark maps with colored banners using the Banner Markers add-on.",
  "Mr. Gadget's crazy lab features laser-powered drones, jetpacks, and custom turrets!",
  "Happy Town brings 500+ themed furniture variants and trainable pets to your world.",
  "Signs, nametags, and in-game chat correctly align Arabic text with the Arabic Fix add-on.",
  "Design custom small chest UIs with drag-and-drop using Chest UI Editor.",
  "Generate custom player heads with 3D live preview and placeable heads using Player Heads.",
  "'Mr. Gadget' world template was the first work in the Minecraft Marketplace."
];

let isPanoramaLoading = false;

function openPanoramaView() {
  if (!currentProjectPanorama || isPanoramaLoading) return;

  const targetPanoramaPath = currentProjectPanorama;
  closeProjectModal();

  showBedrockWorldLoading(targetPanoramaPath, () => {
    launchPanoramaModal(targetPanoramaPath);
  });
}

function showBedrockWorldLoading(panoramaBasePath, onReady) {
  isPanoramaLoading = true;

  const screenLoading = document.getElementById('screen-panorama-loading');
  const tipEl = document.getElementById('bedrock-loading-tip');
  const barEl = document.getElementById('bedrock-segmented-bar');

  if (!screenLoading || !barEl) {
    isPanoramaLoading = false;
    onReady();
    return;
  }

  if (tipEl) {
    const randomTip = bedrockLoadingTips[Math.floor(Math.random() * bedrockLoadingTips.length)];
    tipEl.textContent = randomTip;
  }

  const fillEl = document.getElementById('bedrock-seg-fill');
  if (fillEl) {
    fillEl.style.width = '0px';
  }

  screenLoading.style.display = 'flex';
  screenLoading.classList.remove('show');
  void screenLoading.offsetWidth;
  screenLoading.classList.add('show');

  const faceUrls = [
    `${panoramaBasePath}/panorama_0.webp`,
    `${panoramaBasePath}/panorama_1.webp`,
    `${panoramaBasePath}/panorama_2.webp`,
    `${panoramaBasePath}/panorama_3.webp`,
    `${panoramaBasePath}/panorama_4.webp`,
    `${panoramaBasePath}/panorama_5.webp`
  ];

  let loadedCount = 0;
  const totalFaces = faceUrls.length;
  const startTime = performance.now();
  const minLoadTime = 1600;
  let isDone = false;

  let displayedRatio = 0;

  const updateProgressTicks = (ratio) => {
    if (!fillEl) return;
    displayedRatio = Math.max(displayedRatio, Math.min(1.0, ratio));
    fillEl.style.width = (displayedRatio * 100).toFixed(2) + '%';
  };

  const onFaceLoaded = () => {
    loadedCount++;
  };

  faceUrls.forEach(url => {
    const img = new Image();
    img.onload = () => {
      if (typeof img.decode === 'function') {
        img.decode().then(onFaceLoaded).catch(onFaceLoaded);
      } else {
        onFaceLoaded();
      }
    };
    img.onerror = onFaceLoaded;
    img.src = url;
    if (img.complete) {
      if (typeof img.decode === 'function') {
        img.decode().then(onFaceLoaded).catch(onFaceLoaded);
      } else {
        onFaceLoaded();
      }
    }
  });

  function step(now) {
    if (isDone) return;

    const elapsed = (now || performance.now()) - startTime;
    const timeRatio = Math.min(1.0, elapsed / minLoadTime);
    const assetRatio = loadedCount / totalFaces;

    let currentProgressRatio = 0;

    if (loadedCount >= totalFaces) {
      currentProgressRatio = timeRatio;
    } else {
      currentProgressRatio = Math.min(timeRatio, assetRatio) * 0.88;
    }

    updateProgressTicks(currentProgressRatio);

    if (loadedCount >= totalFaces && elapsed >= minLoadTime) {
      isDone = true;
      updateProgressTicks(1.0);

      setTimeout(() => {
        onReady();

        screenLoading.classList.remove('show');

        setTimeout(() => {
          screenLoading.style.display = 'none';
          isPanoramaLoading = false;
        }, 350);
      }, 150);
      return;
    }

    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function launchPanoramaModal(panoramaBasePath) {
  const panoramaModal = document.getElementById('panorama-modal');
  if (!panoramaModal) return;

  const panoramaImages = [
    `${panoramaBasePath}/panorama_0.webp`,
    `${panoramaBasePath}/panorama_1.webp`,
    `${panoramaBasePath}/panorama_2.webp`,
    `${panoramaBasePath}/panorama_3.webp`,
    `${panoramaBasePath}/panorama_4.webp`,
    `${panoramaBasePath}/panorama_5.webp`
  ];

  const faceMapping = ['pano-front', 'pano-right', 'pano-back', 'pano-left', 'pano-top', 'pano-bottom'];
  faceMapping.forEach((faceClass, index) => {
    const face = panoramaModal.querySelector(`.${faceClass}`);
    if (face) {
      face.style.backgroundImage = `url('${panoramaImages[index]}')`;
    }
  });

  panoramaModalState = {
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
    rotation: { x: -6, y: 0 },
    isAutoRotating: true
  };

  const panoCube = panoramaModal.querySelector('#pano-cube');
  const panorama = panoramaModal.querySelector('.panorama');
  if (panoCube) {
    panoCube.style.animation = 'pano-spin 120s linear infinite';
  }
  if (panorama) {
    panorama.classList.remove('interactive');
  }

  panoramaModal.classList.add('show');
  currentProjectPanorama = null;
}

function closePanoramaModal(event) {
  if (event && event.target && event.target !== event.currentTarget && !event.target.classList.contains('panorama-close-btn') && !event.target.closest('.panorama-close-btn')) {
    return;
  }

  playDrawerClose();
  const panoramaModal = document.getElementById('panorama-modal');
  if (panoramaModal) {
    panoramaModal.classList.remove('show');
  }
}

function initPanoramaModal() {
  const panoramaModal = document.getElementById('panorama-modal');
  if (!panoramaModal) return;

  const panorama = panoramaModal.querySelector('.panorama');
  const panoCube = panoramaModal.querySelector('#pano-cube');

  if (!panorama || !panoCube) return;

  function updateCubeRotation() {
    panoCube.style.transform = `translateZ(70vh) rotateX(${panoramaModalState.rotation.x}deg) rotateY(${panoramaModalState.rotation.y}deg)`;
  }

  function enterInteractiveMode() {
    if (!panoramaModalState.isAutoRotating) return;

    panoramaModalState.isAutoRotating = false;
    panorama.classList.add('interactive');

    const computedStyle = window.getComputedStyle(panoCube);
    const matrix = computedStyle.transform;

    if (matrix === 'none' || matrix === 'matrix(1, 0, 0, 1, 0, 0)') {
      panoramaModalState.rotation = { x: -6, y: 0 };
    } else {
      panoramaModalState.rotation = { x: -6, y: 0 };
    }

    updateCubeRotation();
  }

  function exitInteractiveMode() {
    if (panoramaModalState.isAutoRotating) return;

    panoramaModalState.isAutoRotating = true;
    panorama.classList.remove('interactive');
    panoCube.style.animation = 'pano-spin 120s linear infinite';
  }

  panorama.addEventListener('mousedown', (e) => {
    enterInteractiveMode();
    panoramaModalState.isDragging = true;
    panoramaModalState.previousMousePosition = { x: e.clientX, y: e.clientY };
  });

  document.addEventListener('mousemove', (e) => {
    if (!panoramaModalState.isDragging) return;

    const deltaX = e.clientX - panoramaModalState.previousMousePosition.x;
    const deltaY = e.clientY - panoramaModalState.previousMousePosition.y;

    panoramaModalState.rotation.y += deltaX * 0.5;
    panoramaModalState.rotation.x -= deltaY * 0.5;

    panoramaModalState.rotation.x = Math.max(-90, Math.min(90, panoramaModalState.rotation.x));

    panoramaModalState.previousMousePosition = { x: e.clientX, y: e.clientY };
    updateCubeRotation();
  });

  document.addEventListener('mouseup', () => {
    panoramaModalState.isDragging = false;
  });

  panorama.addEventListener('dblclick', () => {
    exitInteractiveMode();
  });
}

document.addEventListener('DOMContentLoaded', initPanoramaModal);

function closeProjectModal(e) {
  if (e && e.target && e.target !== e.currentTarget && !e.target.classList.contains('close-modal') && !e.target.closest('.button.secondary')) {
    return;
  }
  playDrawerClose();
  const modal = document.getElementById('ore-project-modal');
  if (modal) modal.classList.remove('show');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const panoramaModal = document.getElementById('panorama-modal');
    if (panoramaModal && panoramaModal.classList.contains('show')) {
      playDrawerClose();
      panoramaModal.classList.remove('show');
      return;
    }

    const modal = document.getElementById('ore-project-modal');
    if (modal && modal.classList.contains('show')) {
      playDrawerClose();
      modal.classList.remove('show');
    }
    hideSocialTooltip();
    const drawer = document.getElementById('ore-social-drawer');
    const overlay = document.getElementById('ore-drawer-overlay');
    if (drawer && drawer.classList.contains('open')) {
      playDrawerClose();
      drawer.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
    }
  }
});