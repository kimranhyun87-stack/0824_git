// Main JavaScript for Generative AI Portfolio

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileMenu();
    initPromptSimulation();
    initGalleryFilter();
    initGalleryModal();
    initScrollReveal();
});

// 1. Header scroll effect
function initHeaderScroll() {
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// 2. Mobile Menu Toggle
function initMobileMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');

    menuBtn.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.contains('hidden');
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            menuIcon.className = 'fa-solid fa-xmark text-xl';
        } else {
            mobileMenu.classList.add('hidden');
            menuIcon.className = 'fa-solid fa-bars text-xl';
        }
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuIcon.className = 'fa-solid fa-bars text-xl';
        });
    });
}

// 3. Simulated AI Prompt Typing & Generation
function initPromptSimulation() {
    const typingPrompt = document.getElementById('typing-prompt');
    const genPlaceholder = document.getElementById('gen-placeholder');
    const genLoader = document.getElementById('gen-loader');
    const genImage = document.getElementById('gen-image');
    const genBadge = document.getElementById('gen-badge');
    const genStatus = document.getElementById('gen-status');

    const prompts = [
        {
            text: "imagine a futuristic biophilic city in Seoul, neon lighting, octane render --ar 16:9",
            image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=600&q=80",
            style: "Cyberpunk Surrealism"
        },
        {
            text: "cozy vintage clockmaker workshop with glowing mechanical butterflies, golden hour --ar 16:9",
            image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
            style: "Fantasy Realism"
        },
        {
            text: "breathtaking cinematic shot of a bioluminescent cyber whale swimming in deep trench --ar 16:9",
            image: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=600&q=80",
            style: "Sci-Fi Cinematic"
        }
    ];

    let currentPromptIndex = 0;

    function runSimulation() {
        const current = prompts[currentPromptIndex];
        
        // Reset state
        typingPrompt.textContent = "";
        genImage.classList.add('hidden');
        genBadge.classList.add('hidden');
        genStatus.classList.add('hidden');
        genLoader.classList.add('hidden');
        genPlaceholder.classList.remove('hidden');
        
        let charIndex = 0;
        
        // Typing effect
        function type() {
            if (charIndex < current.text.length) {
                typingPrompt.textContent += current.text.charAt(charIndex);
                charIndex++;
                setTimeout(type, 40);
            } else {
                // Done typing, start rendering
                setTimeout(renderImage, 800);
            }
        }

        function renderImage() {
            genPlaceholder.classList.add('hidden');
            genLoader.classList.remove('hidden');
            
            // Simulate generation progress
            setTimeout(() => {
                genLoader.classList.add('hidden');
                genImage.src = current.image;
                genImage.classList.remove('hidden');
                genBadge.classList.remove('hidden');
                
                // Show Success status
                genStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> Generation successful in 1.8s. Style: ${current.style}.`;
                genStatus.classList.remove('hidden');
                
                // Prepare next simulation
                currentPromptIndex = (currentPromptIndex + 1) % prompts.length;
                setTimeout(runSimulation, 6000); // Wait 6 seconds before running the next prompt
            }, 2000);
        }

        setTimeout(type, 1000);
    }

    if (typingPrompt) {
        runSimulation();
    }
}

// 4. Gallery Category Filtering
function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    // Show item
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    // Hide item
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    item.style.display = 'none';
                }
            });
        });
    });
}

// 5. Gallery Details Lightbox Modal
function initGalleryModal() {
    const modal = document.getElementById('details-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('close-modal-btn');
    const closeFooterBtn = document.getElementById('close-modal-footer-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Modal elements to populate
    const modalMediaContainer = document.querySelector('.modal-media');
    const modalTitleText = document.getElementById('modal-title-text');
    const modalDesc = document.getElementById('modal-desc');
    const modalPrompt = document.getElementById('modal-prompt');
    const modalToolsContainer = document.getElementById('modal-tools-container');

    function openModal(item) {
        // [초보자용 주석] 1. 텍스트 정보 가져오기: 클릭한 카드의 내부에 숨겨진 '상세 보기' 버튼에서 제목, 설명 등의 데이터를 읽어옵니다.
        const btn = item.querySelector('.view-detail-btn');
        if (!btn) return;

        const title = btn.getAttribute('data-title');
        const desc = btn.getAttribute('data-desc');
        const prompt = btn.getAttribute('data-prompt');
        const tools = btn.getAttribute('data-tools').split(', ');
        const imgSrc = btn.getAttribute('data-img');

        // [초보자용 주석] 2. 파사드 패턴 핵심: 클릭한 카드의 HTML 구조에서 'data-youtube-id' 속성(유튜브 고유 주소)이 있는지 찾습니다.
        const videoPlaceholder = item.querySelector('.video-placeholder');
        const youtubeId = videoPlaceholder ? videoPlaceholder.getAttribute('data-youtube-id') : null;

        // 모달 푸터 버튼 및 YouTube 바로가기 버튼 처리
        const modalFooter = document.querySelector('.modal-footer');
        let ytLinkBtn = document.getElementById('modal-yt-btn');

        // [초보자용 주석] 3. 미디어 통합 처리: 유튜브 ID가 존재하면(영상 카드) <iframe> 태그를 생성해 유튜브 플레이어를 동적으로 끼워 넣고, 유튜브 ID가 없으면(이미지 카드) <img> 태그를 삽입합니다. (이것이 하나의 모달로 모두 처리하는 통합 모달 패턴입니다)
        if (youtubeId) {
            const isFileProtocol = window.location.protocol === 'file:';
            const fileNotice = isFileProtocol ? `
                <div style="position:absolute; bottom:8px; left:8px; right:8px; background:rgba(15,23,42,0.85); color:#f8fafc; font-size:11px; padding:6px 10px; border-radius:6px; z-index:10; display:flex; align-items:center; justify-content:space-between; backdrop-filter:blur(4px);">
                    <span>⚠️ 로컬 파일(file://) 환경에서는 유튜브 보안 정책으로 재생이 차단될 수 있습니다. (Live Server 권장)</span>
                    <a href="https://www.youtube.com/watch?v=${youtubeId}" target="_blank" rel="noopener noreferrer" style="color:#38bdf8; font-weight:bold; margin-left:8px; text-decoration:underline; white-space:nowrap;">새 탭에서 열기</a>
                </div>` : '';

            // [초보자용 주석] 4. 자동 재생과 음소거 정책: '?autoplay=1&mute=1' 옵션을 주목해 주세요. 
            // 최근 웹 브라우저들은 사용자 보호를 위해 '소리가 켜진 영상'의 자동 재생을 강제로 차단합니다.
            // 따라서 모달창이 열릴 때 영상이 화면에서 바로 움직이게(자동 재생) 하려면, 반드시 음소거(mute=1)를 함께 설정해야 합니다. (실무 표준 방식)
            modalMediaContainer.innerHTML = `
                <iframe src="https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&rel=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="position:absolute; top:0; left:0; width:100%; height:100%; border-radius:12px;"></iframe>
                ${fileNotice}
            `;
            // aspect-ratio 처리를 위해 인라인 스타일 추가
            modalMediaContainer.style.position = 'relative';
            modalMediaContainer.style.paddingBottom = '56.25%';

            // 푸터에 YouTube에서 보기 버튼 추가
            if (!ytLinkBtn) {
                ytLinkBtn = document.createElement('a');
                ytLinkBtn.id = 'modal-yt-btn';
                ytLinkBtn.target = '_blank';
                ytLinkBtn.rel = 'noopener noreferrer';
                ytLinkBtn.style.cssText = 'display:inline-flex; align-items:center; gap:6px; padding:0.625rem 1.25rem; background-color:#ef4444; color:#ffffff; border-radius:0.5rem; font-size:0.75rem; font-weight:700; text-decoration:none; margin-right:auto; transition:background-color 0.15s;';
                ytLinkBtn.onmouseover = () => { ytLinkBtn.style.backgroundColor = '#dc2626'; };
                ytLinkBtn.onmouseout = () => { ytLinkBtn.style.backgroundColor = '#ef4444'; };
                modalFooter.insertBefore(ytLinkBtn, closeFooterBtn);
            }
            ytLinkBtn.href = `https://www.youtube.com/watch?v=${youtubeId}`;
            ytLinkBtn.innerHTML = `<i class="fa-brands fa-youtube"></i> YouTube에서 보기`;
            ytLinkBtn.style.display = 'inline-flex';
        } else {
            modalMediaContainer.style.position = '';
            modalMediaContainer.style.paddingBottom = '';
            modalMediaContainer.innerHTML = `<img id="modal-img" src="${imgSrc}" alt="${title}" class="modal-img-tag">`;
            if (ytLinkBtn) {
                ytLinkBtn.style.display = 'none';
            }
        }

        // Populate details
        modalTitleText.textContent = title;
        modalDesc.textContent = desc;
        modalPrompt.textContent = prompt;
        
        // Populate tools badges
        modalToolsContainer.innerHTML = '';
        tools.forEach(tool => {
            const badge = document.createElement('span');
            badge.className = 'text-xs bg-slate-100 text-slate-800 px-3 py-1 rounded-full border border-slate-200 font-semibold';
            badge.textContent = tool;
            modalToolsContainer.appendChild(badge);
        });

        // Show Modal
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }

    function closeModal() {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
        // [초보자용 주석] 모달 닫기 처리가 가장 중요합니다! 모달 창 안의 내용(iframe)을 완전히 삭제(초기화)해야 유튜브 영상이 보이지 않는 화면 뒤에서 계속 재생되면서 소리가 나는 현상(유령 재생 버그)을 막을 수 있습니다.
        modalMediaContainer.innerHTML = ''; 
    }

    // 카드 전체에 클릭 이벤트 등록
    galleryItems.forEach(item => {
        item.addEventListener('click', () => openModal(item));
    });

    closeBtn.addEventListener('click', closeModal);
    closeFooterBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // Escape key press closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}



// 7. Scroll Reveal effect on sections
function initScrollReveal() {
    const sections = document.querySelectorAll('section');
    
    // Dynamically apply reveal class to section contents
    sections.forEach(sec => {
        const children = sec.children;
        for (let i = 0; i < children.length; i++) {
            children[i].classList.add('reveal');
        }
    });

    const reveal = () => {
        const reveals = document.querySelectorAll('.reveal');
        const windowHeight = window.innerHeight;
        
        reveals.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 100; // threshold px
            
            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', reveal);
    // Initial run on load
    setTimeout(reveal, 100);
}
