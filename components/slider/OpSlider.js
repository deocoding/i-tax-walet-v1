import Image from "next/image";
import React, { Component } from "react";
import Slider from "react-slick";
import Zoom from "react-medium-image-zoom";

// function SampleNextArrow(props) {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{ ...style, display: "block", background: "green" }}
//       onClick={onClick}
//     />
//   );
// }

export default class OpSlider extends Component {
  render() {
    const fotos = this.props.data;
    let slideShow;
    let slideScroll;
    if (fotos && fotos.length > 4) {
      slideShow = 4;
      slideScroll = 2;
    } else if (fotos && fotos.length > 1 && fotos.length <= 4) {
      slideShow = fotos.length;
      slideScroll = fotos.length - 1;
    } else {
      slideShow = 1;
      slideScroll = 1;
    }
    var settings = {
      dots: true,
      infinite: true,
      slidesToShow: slideShow,
      slidesToScroll: slideScroll,
      autoplay: true,
      autoplaySpeed: 2000,
    };

    return (
      <div>
        <nav className="tab-nav mb-5">
          <button className="nav-link h5 uppercase active">
            Foto Bangunan
          </button>
        </nav>
        <Slider {...settings}>
          {fotos &&
            fotos.map((foto) => (
              <div key={foto._id}>
                <div className="mx-2">
                  <Zoom zoomMargin={20}>
                    <Image
                      className="border border-gray-300 dark:border-gray-900 rounded-lg text-center"
                      src={foto.image}
                      alt={foto._id}
                      width={250}
                      height={150}
                      quality={100}
                    />
                  </Zoom>
                </div>
              </div>
            ))}
        </Slider>
      </div>
    );
  }
}
