// import React, {useContext, useEffect, useState,useRef, ReactElement} from "react";
// import ReactDOM from 'react-dom';
// import {FirebaseContext } from '@/functions/FirebaseContext';
// import { createChart,ColorType } from 'lightweight-charts';
// import { CrosshairMode } from 'lightweight-charts';
// import { child } from "firebase/database";
// import {IChartApi, ISeriesApi} from "lightweight-charts"



// export default function Chart({ id, interact ,className, classChart, classTitle, title, classPrice , price , classVolume, volume, classOther, other }: {id?: string,interact:boolean,className: string, classChart?: string, classTitle?: string, title?: string, classPrice?: string, price?: number ,  classVolume?: string, volume?: number, classOther?: string, other?: ReactElement[] | ReactElement}) {
//   const chartRef = useRef<HTMLDivElement>(null);
//   const titleRef = useRef<Node | null>(null);
//   const priceRef = useRef<Node | null>(null);
//   const volRef = useRef<Node | null>(null);
//   const otherRef = useRef<HTMLDivElement | null>(null)


//   const chartInstance = useRef<IChartApi | null>(null);
//   const lineSeriesInstance = useRef<ISeriesApi<"Line"> | null>(null);

  
// useEffect(()=>{
//   if (chartRef.current && !chartRef.current.hasChildNodes()) {
  
//     const chart = createChart(chartRef.current, {
//       width:100,
//       height:100,
//       autoSize: true,
//       watermark: {color:"",text:"test" ,visible:false},
//       layout: {background:{type: ColorType.Solid,
//       color: "rgb(0,0,0,0)",},},
//       leftPriceScale: { autoScale: true,
//         mode:0,
//         alignLabels: false,
//         scaleMargins: {
//           top: 0.1,
//           bottom: 0.1,
//         },
//         borderColor:"rgb(0,0,0,0)",
//         borderVisible:false,
//         visible:interact,
//         ticksVisible:false,
//         textColor:"rgb(0,0,0,0)",
//         entireTextOnly: false,
//       },
//       rightPriceScale: { autoScale: true,
//         mode:0,
//         alignLabels: false,
//         scaleMargins: {
//           top: 0.1,
//           bottom: 0.1,
//         },
//         borderColor:"rgb(0,0,0,0)",
//         borderVisible:false,
//         visible:interact,
//         ticksVisible:false,
//         textColor:"rgb(0,0,0,0)",
//         entireTextOnly: false,
//       },
//       // overlayPriceScales: { autoScale: true, visible:false,
//       // },
//       timeScale: {
//         borderColor: "rgb(0,0,0,0)",
//         barSpacing:100,
//         borderVisible:false,
//         visible:interact,
//         secondsVisible:false,
//         timeVisible:interact,
//         ticksVisible:false,
//         shiftVisibleRangeOnNewBar:false,
//         fixRightEdge:true,
//         fixLeftEdge:true,
//         rightOffset:0,
//         },
//       crosshair: {mode: 0,
//           vertLine:  {
//             color:  "blue",
//             width: 1,
//             visible: interact,
//             style: 4,
//             labelBackgroundColor: "rgb(0,0,0)",
//             labelVisible: interact,
//           },
//           horzLine: {
//             color:  "blue",
//             width: 1,
//             style: 4,
//             visible: interact,
//             labelBackgroundColor: "rgb(0,0,0)",
//             labelVisible: interact,
//           },
//       },
//       grid: {	
//         vertLines: {
//         color: "rgb(0,0,0,0)",
//         style: 0,
//         visible: false,},
//         horzLines: {
//            color: "rgb(0,0,0,0)",
//         style: 0,
//         visible: false,}
//       },
//       // localization: LocalizationOptions,
//       handleScroll:  {mouseWheel:interact,pressedMouseMove:interact,horzTouchDrag:interact,vertTouchDrag:interact},
//       handleScale:  {mouseWheel:interact,pinch:interact,axisPressedMouseMove:interact},
//       // kineticScroll: KineticScrollOptions,
//       // trackingMode: TrackingModeOptions,
//     });
//     window.addEventListener('resize', () => {
//       //@ts-ignore
//       chart.resize(chartRef.current?.parentElement?.clientWidth, chartRef.current?.parentElement?.clientHeight);
//   });

//   chartInstance.current = chart;
//   const lineSeries = chart.addLineSeries({baseLineVisible:false,baseLineColor:"blue",baseLineWidth:2,baseLineStyle:0,priceFormat:{type:"price",precision:2,minMove:0.01},lastValueVisible:false,priceLineVisible:false,priceLineWidth:2,priceLineColor:"blue",priceLineStyle:1,color:"rgba(29, 87, 235, 1)",lineStyle: 0,	lineWidth: 2,	lineType: 2,crosshairMarkerVisible: false,crosshairMarkerRadius: 2,crosshairMarkerBorderColor: "blue",crosshairMarkerBackgroundColor: "blue",crosshairMarkerBorderWidth: 0,	lastPriceAnimation: 2});

//     chart.timeScale().fitContent()

//   lineSeries.setData([
//     { time: '2019-04-11', value: 80.01 },
//     { time: '2019-04-12', value: 96.63 },
//     { time: '2019-04-13', value: 76.64 },
//     { time: '2019-04-14', value: 81.89 },
//     { time: '2019-04-15', value: 74.43 },
//     { time: '2019-04-16', value: 80.01 },
//     { time: '2019-04-17', value: 96.63 },
//     { time: '2019-04-18', value: 76.64 },
//     { time: '2019-04-19', value: 81.89 },
//     { time: '2019-04-20', value: 90.43 },
//   ]);

//   lineSeriesInstance.current = lineSeries;
//   if(title){ 
//     titleRef.current = document.createElement('div');
//     chartRef.current.appendChild(titleRef.current)
//     //@ts-ignore
//     titleRef.current.className=classTitle;
//     //@ts-ignore
//     titleRef.current.innerHTML =	title;
//   }
//   if(price){
//     priceRef.current = document.createElement('div');
//     chartRef.current.appendChild(priceRef.current)
//     //@ts-ignore
//     priceRef.current.className=classPrice;
//     //@ts-ignore
//     priceRef.current.innerHTML =	price;
//   }
//   if(volume){
//     volRef.current = document.createElement('div');
//     chartRef.current.appendChild(volRef.current)
//     //@ts-ignore
//     volRef.current.className=classVolume;
//     //@ts-ignore
//     volRef.current.innerHTML =	volume;
//   }
//   if(other){
//     otherRef.current = document.createElement('div');
//     chartRef.current.appendChild(otherRef.current)
//     //@ts-ignore
//     otherRef.current.className=classOther;
//     ReactDOM.render(<>{other}</>, otherRef.current);
//   }


//   // return () => {
//   //   if (otherRef.current  && chartRef.current) {
//   //     ReactDOM.unmountComponentAtNode(otherRef.current);
//   //     chartRef.current.removeChild(otherRef.current);
//   //   }
//   //   if (titleRef.current && chartRef.current) {
//   //     chartRef.current.removeChild(titleRef.current);
//   //   }
//   //   if (priceRef.current && chartRef.current) {
//   //     chartRef.current.removeChild(priceRef.current);
//   //   }
//   //   if (volRef.current && chartRef.current) {
//   //     chartRef.current.removeChild(volRef.current);
//   //   }
//   // };
  
//     }


//   },[])

//   useEffect(() => {
//     if (chartInstance.current && lineSeriesInstance.current) {
//       // Update lineSeries data here

//       if (titleRef.current) {
//         //@ts-ignore
//         titleRef.current.innerHTML = title || "";
//       }

//       if (priceRef.current) {
//         //@ts-ignore
//         priceRef.current.innerHTML = price ? price.toString() : "";
//       }

//       if (volRef.current) {
//         //@ts-ignore
//         volRef.current.innerHTML = volume ? volume.toString() : "";
//       }

//       if (otherRef.current) {
//         ReactDOM.render(<>{other}</>, otherRef.current);
//       }
//     }
//   }, [id, title, price, volume, other]);


//   return (    <div className={className}>
   
//     <div ref={chartRef} className={classChart}/>
    
//   </div>
// )
 
// }


import React, {useContext, useEffect, useState,useRef, ReactElement} from "react";
import ReactDOM from 'react-dom';
import {FirebaseContext } from '@/functions/FirebaseContext';
import { createChart,ColorType } from 'lightweight-charts';
import { CrosshairMode } from 'lightweight-charts';
import { child } from "firebase/database";
import {IChartApi, ISeriesApi} from "lightweight-charts"


export default function Chart({ id, interact ,className, classChart, classTitle, title, classPrice , price , classVolume, volume, classOther, other }: {id?: string,interact:boolean,className: string, classChart?: string, classTitle?: string, title?: string, classPrice?: string, price?: number ,  classVolume?: string, volume?: number, classOther?: string, other?: ReactElement[] | ReactElement}) {
  const chartRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const priceRef = useRef<HTMLDivElement | null>(null);
  const volRef = useRef<HTMLDivElement | null>(null);
  const otherRef = useRef<HTMLDivElement | null>(null)

  const chartInstance = useRef<IChartApi | null>(null);
  const lineSeriesInstance = useRef<ISeriesApi<"Line"> | null>(null);
  
  useEffect(()=>{
    if (chartRef.current && !chartRef.current.hasChildNodes()) {
      const chart = createChart(chartRef.current, {
              width:100,
              height:100,
              autoSize: true,
              watermark: {color:"",text:"test" ,visible:false},
              layout: {background:{type: ColorType.Solid,
              color: "rgb(0,0,0,0)",},},
              leftPriceScale: { autoScale: true,
                mode:0,
                alignLabels: false,
                scaleMargins: {
                  top: 0.1,
                  bottom: 0.1,
                },
                borderColor:"rgb(0,0,0,0)",
                borderVisible:false,
                visible:interact,
                ticksVisible:false,
                textColor:"rgb(0,0,0,0)",
                entireTextOnly: false,
              },
              rightPriceScale: { autoScale: true,
                mode:0,
                alignLabels: false,
                scaleMargins: {
                  top: 0.1,
                  bottom: 0.1,
                },
                borderColor:"rgb(0,0,0,0)",
                borderVisible:false,
                visible:interact,
                ticksVisible:false,
                textColor:"rgb(0,0,0,0)",
                entireTextOnly: false,
              },
              // overlayPriceScales: { autoScale: true, visible:false,
              // },
              timeScale: {
                borderColor: "rgb(0,0,0,0)",
                barSpacing:100,
                borderVisible:false,
                visible:interact,
                secondsVisible:false,
                timeVisible:interact,
                ticksVisible:false,
                shiftVisibleRangeOnNewBar:false,
                fixRightEdge:true,
                fixLeftEdge:true,
                rightOffset:0,
                },
              crosshair: {mode: 0,
                  vertLine:  {
                    color:  "blue",
                    width: 1,
                    visible: interact,
                    style: 4,
                    labelBackgroundColor: "rgb(0,0,0)",
                    labelVisible: interact,
                  },
                  horzLine: {
                    color:  "blue",
                    width: 1,
                    style: 4,
                    visible: interact,
                    labelBackgroundColor: "rgb(0,0,0)",
                    labelVisible: interact,
                  },
              },
              grid: {	
                vertLines: {
                color: "rgb(0,0,0,0)",
                style: 0,
                visible: false,},
                horzLines: {
                   color: "rgb(0,0,0,0)",
                style: 0,
                visible: false,}
              },
              // localization: LocalizationOptions,
              handleScroll:  {mouseWheel:interact,pressedMouseMove:interact,horzTouchDrag:interact,vertTouchDrag:interact},
              handleScale:  {mouseWheel:interact,pinch:interact,axisPressedMouseMove:interact},
              // kineticScroll: KineticScrollOptions,
              // trackingMode: TrackingModeOptions,
            });
            window.addEventListener('resize', () => {
              //@ts-ignore
              chart.resize(chartRef.current?.parentElement?.clientWidth, chartRef.current?.parentElement?.clientHeight);
          });
          chart.timeScale().fitContent()
          chartInstance.current = chart;

          const lineSeries = chart.addLineSeries({baseLineVisible:false,baseLineColor:"blue",baseLineWidth:2,baseLineStyle:0,priceFormat:{type:"price",precision:2,minMove:0.01},lastValueVisible:false,priceLineVisible:false,priceLineWidth:2,priceLineColor:"blue",priceLineStyle:1,color:"rgba(29, 87, 235, 1)",lineStyle: 0,	lineWidth: 2,	lineType: 2,crosshairMarkerVisible: false,crosshairMarkerRadius: 2,crosshairMarkerBorderColor: "blue",crosshairMarkerBackgroundColor: "blue",crosshairMarkerBorderWidth: 0,	lastPriceAnimation: 2});
          lineSeries.setData([
            { time: '2019-04-11', value: 80.01 },
            { time: '2019-04-12', value: 96.63 },
            { time: '2019-04-13', value: 76.64 },
            { time: '2019-04-14', value: 81.89 },
            { time: '2019-04-15', value: 74.43 },
            { time: '2019-04-16', value: 80.01 },
            { time: '2019-04-17', value: 96.63 },
            { time: '2019-04-18', value: 76.64 },
            { time: '2019-04-19', value: 81.89 },
            { time: '2019-04-20', value: 90.43 },
          ]);
        
          lineSeriesInstance.current = lineSeries;
      
      if(title && titleRef.current){
        titleRef.current.innerHTML = title;
      }

      if(price && priceRef.current){
        priceRef.current.innerHTML = price.toString();
      }

      if(volume && volRef.current){
        volRef.current.innerHTML = volume.toString();
      }

      if(other && otherRef.current){
        ReactDOM.render(<>{other}</>, otherRef.current);
      }
    }
  },[id, title, price, volume, other]);

  useEffect(() => {
    if (chartInstance.current && lineSeriesInstance.current) {

      if (title && titleRef.current) {
        titleRef.current.innerHTML = title;
      }

      if (price && priceRef.current) {
        priceRef.current.innerHTML = price.toString();
      }

      if (volume && volRef.current) {
        volRef.current.innerHTML = volume.toString();
      }

      if (other && otherRef.current) {
        ReactDOM.render(<>{other}</>, otherRef.current);
      }
    }

    return () => {
      // Remove existing elements
      if (titleRef.current && chartRef.current?.contains(titleRef.current)) {
        chartRef.current.removeChild(titleRef.current);
        titleRef.current = null;
      }

      if (priceRef.current && chartRef.current?.contains(priceRef.current)) {
        chartRef.current.removeChild(priceRef.current);
        priceRef.current = null;
      }

      if (volRef.current && chartRef.current?.contains(volRef.current)) {
        chartRef.current.removeChild(volRef.current);
        volRef.current = null;
      }

      if (otherRef.current && chartRef.current?.contains(otherRef.current)) {
        ReactDOM.unmountComponentAtNode(otherRef.current);
        chartRef.current.removeChild(otherRef.current);
        otherRef.current = null;
      }
    };
  }, [id, title, price, volume, other]);


  return (    
    <div className={className}>
      <div ref={chartRef} className={classChart}/>
      <div ref={titleRef} className={classTitle}></div>
      <div ref={priceRef} className={classPrice}></div>
      <div ref={volRef} className={classVolume}></div>
      <div ref={otherRef} className={classOther}></div>
    </div>
  )
}
         