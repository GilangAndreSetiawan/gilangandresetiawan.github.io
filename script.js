document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       NAVBAR
    ===================================================== */

    const navbar = document.querySelector(".navbar");

    if (navbar) {
        window.addEventListener("scroll", () => {

            if (window.scrollY > 40) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }

        });
    }


    /* =====================================================
       REVEAL ANIMATION
    ===================================================== */

    const revealElements = document.querySelectorAll(
        ".project-card, .about-content, .skills-grid, .results-content, .contact-content, .section-heading, .footer-brand"
    );

    const revealObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    revealObserver.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.12
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });


    /* =====================================================
       STAT COUNT-UP
    ===================================================== */

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    const counters =
        document.querySelectorAll(
            ".stat strong, .big-result strong"
        );


    function animateCounter(element) {

        const original =
            element.dataset.target;

        const match =
            original.match(/^([\d,.]+)(.*)$/);

        if (!match) return;

        const target =
            parseFloat(match[1].replace(/,/g, ""));

        const suffix = match[2];

        const useComma =
            match[1].includes(",");

        const duration = 1600;

        const start = performance.now();


        function frame(now) {

            const progress =
                Math.min((now - start) / duration, 1);

            const eased =
                1 - Math.pow(1 - progress, 3);

            const value =
                Math.round(target * eased);

            element.textContent =
                (useComma
                    ? value.toLocaleString("en-US")
                    : value) + suffix;

            if (progress < 1) {

                requestAnimationFrame(frame);

            } else {

                element.textContent = original;

            }

        }

        requestAnimationFrame(frame);

    }


    if (!prefersReducedMotion) {

        const counterObserver =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            animateCounter(entry.target);

                            counterObserver.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.6
                }
            );

        counters.forEach((counter) => {

            const original =
                counter.textContent.trim();

            const match =
                original.match(/^([\d,.]+)(.*)$/);

            if (!match) return;

            counter.dataset.target = original;

            counter.textContent = "0" + match[2];

            counterObserver.observe(counter);

        });

    }


    /* =====================================================
       MESH WAVE BACKGROUND
    ===================================================== */

    function createMesh(section) {

        const canvas =
            document.createElement("canvas");

        canvas.className = "mesh-canvas";

        canvas.setAttribute("aria-hidden", "true");

        section.prepend(canvas);


        const context =
            canvas.getContext("2d");

        if (!context) return;

        const pixelRatio =
            Math.min(window.devicePixelRatio || 1, 2);

        let width = 0;
        let height = 0;
        let running = false;
        let frameId = null;


        function resize() {

            const rect =
                canvas.getBoundingClientRect();

            width = rect.width;
            height = rect.height;

            canvas.width = width * pixelRatio;
            canvas.height = height * pixelRatio;

            context.setTransform(
                pixelRatio, 0, 0,
                pixelRatio, 0, 0
            );

        }


        function pointY(u, v, t) {

            const wave =
                Math.sin(u * 6 + t * 2 + v * 3) *
                    Math.cos(v * 4 - t) * 0.5 +
                Math.sin(u * 3 - t + v * 2) * 0.5;

            return (
                height * (0.18 + v * 0.62) +
                wave * height * 0.13 * (0.4 + v)
            );

        }


        function draw(time) {

            const t = time * 0.00025;

            const rows = 22;
            const cols = 64;

            context.clearRect(0, 0, width, height);

            context.lineWidth = 0.7;


            /*
             * Garis horizontal
             */

            for (let j = 0; j < rows; j++) {

                const v = j / (rows - 1);

                context.beginPath();

                for (let i = 0; i <= cols; i++) {

                    const u = i / cols;

                    const x = u * width;

                    const y = pointY(u, v, t);

                    if (i === 0) {
                        context.moveTo(x, y);
                    } else {
                        context.lineTo(x, y);
                    }

                }

                context.strokeStyle =
                    `rgba(255, 255, 255, ${0.05 + v * 0.13})`;

                context.stroke();

            }


            /*
             * Garis vertikal tipis
             */

            context.strokeStyle =
                "rgba(255, 255, 255, 0.045)";

            for (let i = 0; i <= cols; i += 4) {

                const u = i / cols;

                context.beginPath();

                for (let j = 0; j < rows; j++) {

                    const v = j / (rows - 1);

                    const x = u * width;

                    const y = pointY(u, v, t);

                    if (j === 0) {
                        context.moveTo(x, y);
                    } else {
                        context.lineTo(x, y);
                    }

                }

                context.stroke();

            }


            /*
             * Pudarkan tepi agar berbentuk organik
             */

            context.globalCompositeOperation =
                "destination-in";

            const gradient =
                context.createRadialGradient(
                    width * 0.5, height * 0.5, 0,
                    width * 0.5, height * 0.5,
                    Math.max(width, height) * 0.55
                );

            gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
            gradient.addColorStop(0.6, "rgba(0, 0, 0, 0.6)");
            gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

            context.fillStyle = gradient;

            context.fillRect(0, 0, width, height);

            context.globalCompositeOperation =
                "source-over";

        }


        function loop(time) {

            draw(time);

            if (running) {
                frameId = requestAnimationFrame(loop);
            }

        }


        resize();

        draw(0);

        canvas.classList.add("ready");


        window.addEventListener("resize", () => {

            resize();

            draw(performance.now());

        });


        if (prefersReducedMotion) return;


        /*
         * Animasi hanya berjalan saat terlihat.
         */

        new IntersectionObserver((entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting && !running) {

                    running = true;

                    frameId = requestAnimationFrame(loop);

                } else if (!entry.isIntersecting && running) {

                    running = false;

                    cancelAnimationFrame(frameId);

                }

            });

        }).observe(canvas);

    }


    document
        .querySelectorAll(".hero, .results, .contact")
        .forEach(createMesh);


    /* =====================================================
       HERO PARALLAX
    ===================================================== */

    const heroImage = document.querySelector(".hero-image img");

    if (heroImage) {

        document.addEventListener("mousemove", (event) => {

            const x =
                (event.clientX / window.innerWidth - 0.5) * 5;

            const y =
                (event.clientY / window.innerHeight - 0.5) * 5;

            heroImage.style.transform =
                `scale(1.02) translate(${x}px, ${y}px)`;

        });

    }


    /* =====================================================
       PROJECT IMAGE HOVER
    ===================================================== */

    const projectImages =
        document.querySelectorAll(".project-media img");

    projectImages.forEach((image) => {

        const parent =
            image.closest(".project-media");

        if (!parent) return;

        parent.addEventListener("mouseenter", () => {

            image.style.transform = "scale(1.04)";

        });

        parent.addEventListener("mouseleave", () => {

            image.style.transform = "scale(1)";

        });

    });


    /* =====================================================
       TRAVEL VIDEO MODAL
    ===================================================== */

    const videoModal =
        document.getElementById("videoModal");

    const modalVideo =
        document.getElementById("modalVideo");

    const videoModalClose =
        document.getElementById("videoModalClose");


    function openVideoModal(videoSource) {

        if (!videoModal || !modalVideo || !videoSource) {
            return;
        }

        modalVideo.pause();

        modalVideo.removeAttribute("src");

        modalVideo.load();

        modalVideo.src = videoSource;

        videoModal.classList.add("active");

        document.body.classList.add("video-open");


        modalVideo.addEventListener(
            "loadedmetadata",
            () => {

                modalVideo.play().catch(() => {});

            },
            {
                once: true
            }
        );

    }


    function closeVideoModal() {

        if (!videoModal || !modalVideo) {
            return;
        }

        modalVideo.pause();

        modalVideo.currentTime = 0;

        modalVideo.removeAttribute("src");

        modalVideo.load();

        videoModal.classList.remove("active");

        document.body.classList.remove("video-open");

    }


    /* =====================================================
       PROJECT 03 — TRAVEL
    ===================================================== */

    const videoTriggers =
        document.querySelectorAll(".video-trigger");

    videoTriggers.forEach((trigger) => {

        trigger.addEventListener("click", (event) => {

            event.preventDefault();

            const videoSource =
                trigger.getAttribute("data-video");

            openVideoModal(videoSource);

        });

    });


    if (videoModalClose) {

        videoModalClose.addEventListener(
            "click",
            closeVideoModal
        );

    }


    if (videoModal) {

        videoModal.addEventListener(
            "click",
            (event) => {

                if (event.target === videoModal) {
                    closeVideoModal();
                }

            }
        );

    }


    /* =====================================================
       SHOWCASE MODAL HELPER
    ===================================================== */

    function openShowcase(modal) {

        if (!modal) return;

        modal.classList.add("active");

        document.body.classList.add("video-open");


        /*
         * Jangan langsung memainkan semua video.
         * IntersectionObserver yang akan menentukan
         * video mana yang boleh berjalan.
         */

        const videos =
            modal.querySelectorAll(
                ".showcase-card video"
            );

        videos.forEach((video) => {

            video.muted = true;

            video.pause();

        });


        /*
         * Setelah modal terbuka, cek video yang sedang
         * terlihat di layar.
         */

        setTimeout(() => {

            videos.forEach((video) => {

                const rect =
                    video.getBoundingClientRect();

                const visible =
                    rect.top < window.innerHeight &&
                    rect.bottom > 0;

                if (visible) {

                    video.play().catch(() => {});

                }

            });

        }, 100);

    }


    function closeShowcase(modal) {

        if (!modal) return;

        const videos =
            modal.querySelectorAll(
                ".showcase-card video"
            );

        videos.forEach((video) => {

            video.pause();

        });

        modal.classList.remove("active");

        document.body.classList.remove("video-open");

    }

    /* =====================================================
   SHOWCASE BACK BUTTON
===================================================== */

const showcaseBackButtons =
    document.querySelectorAll(".showcase-back");

showcaseBackButtons.forEach((button) => {

    button.addEventListener("click", (event) => {

        event.preventDefault();
        event.stopPropagation();

        const modal =
            button.closest(".showcase-modal");

        if (!modal) return;

        closeShowcase(modal);

    });

});


    /* =====================================================
       PROJECT 01 — FASHION
    ===================================================== */

    const fashionModal =
        document.getElementById("fashionModal");

    const fashionTriggers =
        document.querySelectorAll(
            ".fashion-trigger"
        );

    fashionTriggers.forEach((trigger) => {

        trigger.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                openShowcase(fashionModal);

            }
        );

    });


    const fashionClose =
        document.getElementById(
            "fashionModalClose"
        );

    if (fashionClose) {

        fashionClose.addEventListener(
            "click",
            () => {

                closeShowcase(
                    fashionModal
                );

            }
        );

    }


    if (fashionModal) {

        fashionModal.addEventListener(
            "click",
            (event) => {

                if (event.target === fashionModal) {

                    closeShowcase(
                        fashionModal
                    );

                }

            }
        );

    }


    /* =====================================================
       PROJECT 02 — PROPERTY DESIGN
    ===================================================== */

    const propertyModal =
        document.getElementById("propertyModal");

    const propertyTriggers =
        document.querySelectorAll(
            ".property-trigger"
        );

    propertyTriggers.forEach((trigger) => {

        trigger.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                openShowcase(propertyModal);

            }
        );

    });


    const propertyClose =
        document.getElementById(
            "propertyModalClose"
        );

    if (propertyClose) {

        propertyClose.addEventListener(
            "click",
            () => {

                closeShowcase(
                    propertyModal
                );

            }
        );

    }


    if (propertyModal) {

        propertyModal.addEventListener(
            "click",
            (event) => {

                if (event.target === propertyModal) {

                    closeShowcase(
                        propertyModal
                    );

                }

            }
        );

    }


    /* =====================================================
       PROJECT 03 — TRAVEL & EVENT
    ===================================================== */

    const travelModal =
        document.getElementById("travelModal");

    const travelTriggers =
        document.querySelectorAll(
            ".travel-trigger"
        );

    travelTriggers.forEach((trigger) => {

        trigger.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                openShowcase(travelModal);

            }
        );

    });


    const travelClose =
        document.getElementById(
            "travelModalClose"
        );

    if (travelClose) {

        travelClose.addEventListener(
            "click",
            () => {

                closeShowcase(
                    travelModal
                );

            }
        );

    }


    if (travelModal) {

        travelModal.addEventListener(
            "click",
            (event) => {

                if (event.target === travelModal) {

                    closeShowcase(
                        travelModal
                    );

                }

            }
        );

    }


    /* =====================================================
       PROJECT 06 — MOTION
    ===================================================== */

    const motionModal =
        document.getElementById("motionModal");

    const motionTriggers =
        document.querySelectorAll(
            ".motion-trigger"
        );

    motionTriggers.forEach((trigger) => {

        trigger.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                openShowcase(motionModal);

            }
        );

    });


    const motionClose =
        document.getElementById(
            "motionModalClose"
        );

    if (motionClose) {

        motionClose.addEventListener(
            "click",
            () => {

                closeShowcase(
                    motionModal
                );

            }
        );

    }


    if (motionModal) {

        motionModal.addEventListener(
            "click",
            (event) => {

                if (event.target === motionModal) {

                    closeShowcase(
                        motionModal
                    );

                }

            }
        );

    }


    /* =====================================================
       PROJECT 04 — AUTOMOTIVE
    ===================================================== */

    const automotiveModal =
        document.getElementById("automotiveModal");

    const automotiveTriggers =
        document.querySelectorAll(
            ".automotive-trigger"
        );

    automotiveTriggers.forEach((trigger) => {

        trigger.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                openShowcase(automotiveModal);

            }
        );

    });


    const automotiveClose =
        document.getElementById(
            "automotiveModalClose"
        );

    if (automotiveClose) {

        automotiveClose.addEventListener(
            "click",
            () => {

                closeShowcase(
                    automotiveModal
                );

            }
        );

    }


    if (automotiveModal) {

        automotiveModal.addEventListener(
            "click",
            (event) => {

                if (event.target === automotiveModal) {

                    closeShowcase(
                        automotiveModal
                    );

                }

            }
        );

    }


    /* =====================================================
       PROJECT 05 — TRANSPORTATION
    ===================================================== */

    const transportationModal =
        document.getElementById(
            "transportationModal"
        );

    const transportationTriggers =
        document.querySelectorAll(
            ".transportation-trigger"
        );

    transportationTriggers.forEach((trigger) => {

        trigger.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                openShowcase(
                    transportationModal
                );

            }
        );

    });


    const transportationClose =
        document.getElementById(
            "transportationModalClose"
        );

    if (transportationClose) {

        transportationClose.addEventListener(
            "click",
            () => {

                closeShowcase(
                    transportationModal
                );

            }
        );

    }


    if (transportationModal) {

        transportationModal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    transportationModal
                ) {

                    closeShowcase(
                        transportationModal
                    );

                }

            }
        );

    }


    /* =====================================================
       SHOWCASE VIDEO PERFORMANCE SYSTEM
       
       HANYA VIDEO YANG TERLIHAT YANG PLAY
       VIDEO YANG KELUAR LAYAR = PAUSE
    ===================================================== */

    const showcaseVideos =
        document.querySelectorAll(
            ".showcase-card video"
        );


    const previewObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    const video =
                        entry.target;

                    const modal =
                        video.closest(
                            ".showcase-modal"
                        );


                    /*
                     * Kalau modal tidak sedang terbuka,
                     * video harus selalu pause.
                     */

                    if (
                        !modal ||
                        !modal.classList.contains(
                            "active"
                        )
                    ) {

                        video.pause();

                        return;

                    }


                    /*
                     * Video masuk viewport
                     */

                    if (entry.isIntersecting) {

                        video.muted = true;

                        video.play().catch(() => {});


                    /*
                     * Video keluar viewport
                     */

                    } else {

                        video.pause();

                    }

                });

            },
            {
                threshold: 0.25
            }
        );


    showcaseVideos.forEach((video) => {

        video.muted = true;

        video.setAttribute(
            "muted",
            ""
        );

        video.setAttribute(
            "playsinline",
            ""
        );

        previewObserver.observe(video);

    });


   /* =====================================================
   SHOWCASE CARD → FULLSCREEN VIDEO
===================================================== */

const showcaseCards =
    document.querySelectorAll(".showcase-card");


/*
 * Menyimpan modal asal video.
 *
 * Contoh:
 * Automotive → Video 01 → Fullscreen
 *
 * previousShowcaseModal akan berisi
 * automotiveModal.
 */

let previousShowcaseModal = null;


showcaseCards.forEach((card) => {

    card.addEventListener("click", (event) => {

        event.preventDefault();
        event.stopPropagation();


        const videoSource =
            card.getAttribute("data-video");

        const youtubeId =
            card.getAttribute("data-youtube");


        const externalLink =
            card.getAttribute("data-link");


        /*
         * Video YouTube / TikTok dibuka di tab baru.
         */

        if (youtubeId || externalLink) {

            window.open(
                externalLink ||
                    `https://www.youtube.com/watch?v=${youtubeId}`,
                "_blank",
                "noopener"
            );

            return;

        }


        if (!videoSource) return;


        /*
         * Cari showcase tempat video berada.
         */

        const parentModal =
            card.closest(".showcase-modal");


        /*
         * Simpan showcase asal.
         */

        if (parentModal) {

            previousShowcaseModal =
                parentModal;


            /*
             * Pause preview video.
             */

            const videos =
                parentModal.querySelectorAll(
                    ".showcase-card video"
                );


            videos.forEach((video) => {

                video.pause();

            });

        }


        /*
         * Buka fullscreen.
         */

        openFullscreenVideo(
            videoSource
        );

    });

});


/* =====================================================
   FULLSCREEN VIDEO
===================================================== */

const fullscreenModal =
    document.getElementById(
        "fullscreenVideoModal"
    );


const fullscreenVideo =
    document.getElementById(
        "fullscreenVideo"
    );


const fullscreenClose =
    document.getElementById(
        "fullscreenVideoClose"
    );


/*
 * Buka fullscreen.
 */

function openFullscreenVideo(videoSource) {

    if (
        !fullscreenModal ||
        !fullscreenVideo ||
        !videoSource
    ) {
        return;
    }


    /*
     * Bersihkan video sebelumnya.
     */

    fullscreenVideo.pause();

    fullscreenVideo.removeAttribute(
        "src"
    );

    fullscreenVideo.load();


    /*
     * Masukkan video baru.
     */

    fullscreenVideo.src =
        videoSource;


    /*
     * Tampilkan fullscreen modal.
     */

    fullscreenModal.classList.add(
        "active"
    );


    document.body.classList.add(
        "video-open"
    );


    /*
     * Play setelah metadata siap.
     */

    fullscreenVideo.addEventListener(
        "loadedmetadata",
        () => {

            fullscreenVideo.play()
                .catch(() => {});

        },
        {
            once: true
        }
    );

}


/* =====================================================
   CLOSE FULLSCREEN VIDEO
===================================================== */

function closeFullscreenVideo() {

    if (
        !fullscreenModal ||
        !fullscreenVideo
    ) {
        return;
    }


    /*
     * Pause fullscreen.
     */

    fullscreenVideo.pause();


    fullscreenVideo.currentTime = 0;


    /*
     * Bersihkan source.
     */

    fullscreenVideo.removeAttribute(
        "src"
    );

    fullscreenVideo.load();


    /*
     * Tutup fullscreen.
     */

    fullscreenModal.classList.remove(
        "active"
    );


    /*
     * =================================================
     * KEMBALI KE MENU VIDEO
     * =================================================
     */

    if (previousShowcaseModal) {

        /*
         * Tampilkan kembali Project 4 / Project 5.
         */

        previousShowcaseModal.classList.add(
            "active"
        );


        /*
         * Tetap lock halaman utama.
         */

        document.body.classList.add(
            "video-open"
        );


        /*
         * Simpan referensi sementara.
         */

        const returnedModal =
            previousShowcaseModal;


        /*
         * Reset variable.
         */

        previousShowcaseModal = null;


        /*
         * Jalankan preview setelah
         * modal benar-benar terlihat.
         */

        setTimeout(() => {

            const videos =
                returnedModal.querySelectorAll(
                    ".showcase-card video"
                );


            videos.forEach((video) => {

                const rect =
                    video.getBoundingClientRect();


                const visible =
                    rect.top <
                        window.innerHeight &&
                    rect.bottom > 0;


                if (visible) {

                    video.play()
                        .catch(() => {});

                }

            });

        }, 150);


    } else {

        /*
         * Kalau tidak ada showcase asal,
         * kembali normal.
         */

        document.body.classList.remove(
            "video-open"
        );

    }

}


/* =====================================================
   FULLSCREEN CLOSE BUTTON
===================================================== */

if (fullscreenClose) {

    fullscreenClose.addEventListener(
        "click",
        (event) => {

            event.preventDefault();
            event.stopPropagation();

            closeFullscreenVideo();

        }
    );

}


/* =====================================================
   FULLSCREEN BACKGROUND CLICK
===================================================== */

if (fullscreenModal) {

    fullscreenModal.addEventListener(
        "click",
        (event) => {

            /*
             * Hanya tutup kalau yang diklik
             * adalah background modal.
             */

            if (
                event.target ===
                fullscreenModal
            ) {

                closeFullscreenVideo();

            }

        }
    );

}


    /* =====================================================
       ESC KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape") {
                return;
            }


            /*
             * Prioritas 1:
             * Fullscreen video
             */

            if (
                fullscreenModal &&
                fullscreenModal.classList.contains(
                    "active"
                )
            ) {

                closeFullscreenVideo();

                return;

            }


            /*
             * Prioritas 2:
             * Travel video
             */

            if (
                videoModal &&
                videoModal.classList.contains(
                    "active"
                )
            ) {

                closeVideoModal();

                return;

            }


            /*
             * Prioritas 3:
             * Travel & Event
             */

            if (
                travelModal &&
                travelModal.classList.contains(
                    "active"
                )
            ) {

                closeShowcase(
                    travelModal
                );

                return;

            }


            /*
             * Prioritas 4:
             * Automotive
             */

            if (
                automotiveModal &&
                automotiveModal.classList.contains(
                    "active"
                )
            ) {

                closeShowcase(
                    automotiveModal
                );

                return;

            }


            /*
             * Prioritas 5:
             * Transportation
             */

            if (
                transportationModal &&
                transportationModal.classList.contains(
                    "active"
                )
            ) {

                closeShowcase(
                    transportationModal
                );

                return;

            }


            /*
             * Prioritas 6:
             * Motion
             */

            if (
                motionModal &&
                motionModal.classList.contains(
                    "active"
                )
            ) {

                closeShowcase(
                    motionModal
                );

                return;

            }


            /*
             * Prioritas 7:
             * Property Design
             */

            if (
                propertyModal &&
                propertyModal.classList.contains(
                    "active"
                )
            ) {

                closeShowcase(
                    propertyModal
                );

                return;

            }


            /*
             * Prioritas 8:
             * Fashion
             */

            if (
                fashionModal &&
                fashionModal.classList.contains(
                    "active"
                )
            ) {

                closeShowcase(
                    fashionModal
                );

            }

        }
    );

});
