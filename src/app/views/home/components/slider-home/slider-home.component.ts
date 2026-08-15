import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
interface SliderItem {
  image: string;
  alt: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  textPosition?: 'left' | 'center' | 'right';
}


@Component({
  selector: 'app-slider-home',
  imports: [],
  templateUrl: './slider-home.component.html',
  styleUrl: './slider-home.component.css',
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SliderHomeComponent {
  slides: SliderItem[] = [
    {
      image: '/sliders/banner-01.webp',
      alt: 'Vitaminas y suplementos'
    }
  ];

  swiperStyles: string[] = [`
    .swiper-button-prev,.swiper-button-next{align-items:center;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);background:rgba(255,255,255,.25);border:1px solid rgba(255,255,255,.55);border-radius:50%;box-shadow:0 10px 30px rgba(9,31,23,.2);box-sizing:border-box;color:#fff;display:flex;height:48px;justify-content:center;margin-top:-24px;overflow:hidden;transition:background-color .3s ease,border-color .3s ease,box-shadow .3s ease,transform .3s cubic-bezier(.22,1,.36,1);width:48px}
    .swiper-button-prev{left:28px}
    .swiper-button-next{right:28px}
    .swiper-button-prev::after,.swiper-button-next::after{font-size:15px;font-weight:900;line-height:1}
    .swiper-button-prev:hover,.swiper-button-next:hover{background:rgba(224,236,204,.85);border-color:rgba(255,255,255,.8);box-shadow:0 14px 34px rgba(9,31,23,.25);color:#18372d;transform:scale(1.06)}
    .swiper-button-prev:active,.swiper-button-next:active{transform:scale(.96)}
    .swiper-button-prev:focus-visible,.swiper-button-next:focus-visible{outline:3px solid rgba(224,236,204,.65);outline-offset:4px}
    @media(max-width:767px){.swiper-button-prev,.swiper-button-next{height:40px;margin-top:-20px;width:40px}.swiper-button-prev{left:14px}.swiper-button-next{right:14px}.swiper-button-prev::after,.swiper-button-next::after{font-size:12px}}
  `];
}
