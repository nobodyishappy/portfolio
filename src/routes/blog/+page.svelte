<script>
    import { base } from '$app/paths';
	import { onMount } from 'svelte';
    import { innerWidth } from 'svelte/reactivity/window';

    import { register } from 'swiper/element/bundle';
    import Swiper from 'swiper/bundle';
    import 'swiper/css/bundle';

    register();

    let { data } = $props();

    $effect(() => {
        const swiper = new Swiper(".swiper", {
            effect: "coverflow",
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: "auto",

            coverflowEffect: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
            },
            pagination: {
                el: ".swiper-pagination",
            },
        });
    });

    

</script>

<div class="recent-swiper">
    <div class="recent-title">
        Recent Blogs
    </div>
    <div class="swiper">
        <div class="swiper-wrapper">
            {#each data.summaries as { slug, title, coverImage }}
                <div class="swiper-slide">
                    <a href="{base}/blog/{slug}">
                        {#if innerWidth.current && innerWidth.current < 800}
                            <img src="{base}/NM4259/{coverImage}_Mobile.png" alt="Cover">
                        {:else}
                            <img src="{base}/NM4259/{coverImage}.png" alt="Cover">
                        {/if}
                        <div class="title-text">{title}</div>
                    </a>
                </div>
            {/each}
        </div>

        <div class="swiper-pagination"></div>
    </div>
</div>



<style lang="scss">
    .recent-swiper {
        background-color: white;
        filter: drop-shadow(0px 0px 5px gray);
        width: 100%;
        .recent-title{
            width: 100%;
            text-align: center;
            padding: 10px 0px;
            font-size: 25px;
            font-weight: 700;
        }

        .swiper {
            padding: 10px 0px 40px;
            .swiper-slide {
                width: 70%;
                border-radius: 20px;
                border: 5px solid gray;
                overflow: hidden;

                img {
                    width: 100%;
                }
                .title-text {
                    position: absolute;
                    width: 100%;
                    height: 20%;
                    bottom: 0px;
                    padding: 0px 20px 10px;
                    align-content: end;
                    font-size: 12px;
                    font-weight: 600;
                    color: white;
                    background-image: linear-gradient(transparent, gray);
                }
            }
        }

        @media (width > 400px) {
            .recent-title {
                font-size: 32px;
            }
            .swiper {
                .swiper-slide {
                    width:50%;
                    .title-text {
                        font-size: 16px;
                    }
                }
            }
        }

        @media (width > 1200px) {
            .recent-title {
                font-size: 40px;
            }
            .swiper {
                .swiper-slide {
                    width:50%;
                    max-width: 1000px;
                    .title-text {
                        font-size: 30px;
                    }
                }
            }
        }
    }
    
</style>