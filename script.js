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
        ".project-card, .about-content, .skills-grid, .results-content, .contact-content"
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
             * Prioritas 4:
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

            }

        }
    );

});