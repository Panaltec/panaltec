import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MessagesService } from '../../services/messages.service';
import { Message } from '../../services/message';
import * as Chart from 'chart.js';
import { EChartOption } from 'echarts';
import * as echarts from 'echarts';
import { NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-d1',
  templateUrl: './d1.component.html',
  styleUrls: ['./d1.component.css'],
  providers: [NgbTabsetConfig] // add NgbTabsetConfig to the component providers
})
export class D1Component implements OnInit {
  
  currentJustify = 'end';
  public LineChart: Chart;
  mensajes: Observable<Message[]>;
  lastData: Observable<Message[]>;
  messajeList1 = [];
  messajeList = [];
  temp1: number;
  hum1: number;
  temp2: number;
  hum2: number;
  count: number;
  weight: number;
  ts;
  date: string;
  cardCount: string;
  today;
  week: Date;
  day: Date;
  month: Date;
  year: Date;
  tempIntMax: number;
  humIntMax: number;
  tempExtMax: number;
  humExtMax: number;
  tempIntMin: number;
  humIntMin: number;
  tempExtMin: number;
  humExtMin: number;
  chartOption: any;
  chartOption1: any;
  chartOption2: any;
  /*tempInterna = [];
  humInterna = [];
  tempExterna = [];
  humExterna = [];
  dias = [];*/


  constructor(private messagesService: MessagesService, config: NgbTabsetConfig) {
    config.type = 'pills';
  }

  ngOnInit() {

    this.today = new Date();
    this.day = new Date();
    this.week = new Date();
    this.month = new Date();
    this.year = new Date();
    this.today.setHours(0, 0, 0, 0);
    this.day.setDate(this.day.getDate() - 1);
    this.week.setDate(this.week.getDate() - 7);
    this.month.setDate(this.month.getDate() - 30);
    this.year.setDate(this.year.getDate() - 365);
    this.getDataCard();
    this.graphTemp();
    this.getMinMax();
    //this.getDataGrapWeek();
    // this.graph();
    this.graphWeight();
    this.graphActivity();
  }


  getDataCard() {
    this.lastData = this.messagesService.getMessagesList().valueChanges();
    this.lastData.subscribe(result => {
      this.temp1 = result[result.length - 1].temp1;
      this.hum1 = result[result.length - 1].hum1;
      this.temp2 = result[result.length - 1].temp2;
      this.hum2 = result[result.length - 1].hum2;
      this.count = result[result.length - 1].count;
      this.weight = result[result.length - 1].weight;
      this.ts = result[result.length - 1].ts;
      this.date = new Date(this.ts).toLocaleString('ch');
      this.actividad();
    });
  }

  /*getDataCard() {
    this.lastData = this.messagesService.getLastData('ts').valueChanges();
    this.lastData.subscribe(result => {
      this.temp1 = result[result.length - 1].temp1;
      this.hum1 = result[result.length - 1].hum1;
      this.temp2 = result[result.length - 1].temp2;
      this.hum2 = result[result.length - 1].hum2;
      this.count = result[result.length - 1].count;
      this.weight = result[result.length - 1].weight;
      this.ts = result[result.length - 1].ts;
      this.actividad();
    });
  }*/

  actividad() {
    if (this.count <= 1) {
      this.cardCount = 'bajo';
    }
    if (this.count > 1 && this.count <= 3) {
      this.cardCount = 'medio';
    }
    if (this.count > 3) {
      this.cardCount = 'alto';
    }
  }

  getMinMax() {
    this.messagesService.getDateListQueried('ts', this.today.toISOString())
      .snapshotChanges()
      .subscribe(items => {
        this.messajeList1 = [];
        items.forEach(elements => {
          const z = elements.payload.toJSON();
          z['$key'] = elements.key;
          this.messajeList1.push(z as Message);
        });
        const tempInterna = this.messajeList1.map(res => res.temp1);
        const humInterna = this.messajeList1.map(res => res.hum1);
        const tempExterna = this.messajeList1.map(res => res.temp2);
        const humExterna = this.messajeList1.map(res => res.hum2);

        if (tempInterna.length === 0 && humInterna.length === 0 && tempExterna.length === 0 && humExterna.length === 0) {

          this.tempIntMax = 0;
          this.humIntMax = 0;
          this.tempExtMax = 0;
          this.humExtMax = 0;
          this.tempIntMin = 0;
          this.humIntMin = 0;
          this.tempExtMin = 0;
          this.humExtMin = 0;
        } else {
          this.tempIntMax = Math.max.apply(Math, tempInterna);
          this.humIntMax = Math.max.apply(Math, humInterna);
          this.tempExtMax = Math.max.apply(Math, tempExterna);
          this.humExtMax = Math.max.apply(Math, humExterna);

          this.tempIntMin = Math.min.apply(Math, tempInterna);
          this.humIntMin = Math.min.apply(Math, humInterna);
          this.tempExtMin = Math.min.apply(Math, tempExterna);
          this.humExtMin = Math.min.apply(Math, humExterna);
        }
      });
  }

  graphTemp() {
    this.messajeList.length = 0;
    this.messagesService.getDateListQueried('ts', this.year.toISOString())
      .snapshotChanges()
      .subscribe(items => {
        this.messajeList = [];
        items.forEach(elements => {
          const z = elements.payload.toJSON();
          z['$key'] = elements.key;
          this.messajeList.push(z as Message);
        });
        const tempInterna = this.messajeList.map(res => res.temp1);
        const humInterna = this.messajeList.map(res => res.hum1);
        const tempExterna = this.messajeList.map(res => res.temp2);
        const humExterna = this.messajeList.map(res => res.hum2);
        const date = this.messajeList.map(res => res.ts);
        const dias = [];

        date.forEach(result => {
          const jsDate = new Date(result).toLocaleString('ch');
          dias.push(jsDate);
        });

        this.chartOption = {
          backgroundColor: '#FFFFFF',
          textStyle: {
            fontFamily: 'Poppins',
            fontWeight: 300,
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                color: '#57617B' // barra vertical puntero
              }
            },
            textStyle: {
              fontSize: 12,
            },
          },
          legend: { // leyenda
            icon: 'circle',
            align: 'auto',
            //top: 300,
            //itemGap: 20,
            data: ['Temp. Interna (°C)', 'Hum. Interna (%)', 'Temp. Externa (°C)', 'Hum. Externa (%)'],
            textStyle: {
              fontSize: 12,
              fontFamily: 'Poppins',
              fontWeight: 200,
              color: '#1d253b'
            },
            selected: {
              'Temp. Interna (°C)': true,
              'Hum. Interna (%)': false,
              'Temp. Externa (°C)': false,
              'Hum. Externa (%)': false
            }
          },
          grid: {
            left: '1%',
            right: '2%',
            bottom: '20%',
            top: '10%',
            containLabel: true
          },
          dataZoom: [{
            type: 'inside',
            start: 80,
            end: 100
          }, {
            start: 0,
            end: 10,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 3,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }],
          xAxis: [{
            type: 'category',
            show: true,
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#1d253b', // Color letras eje horizontal
                fontWeight: 200,
                fontSize: 12,
              }
            },
            data: dias
          }, {
            axisPointer: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#9A9A9A', // color eje horizontal
              }
            },
            axisTick: {
              show: false
            },
          }],
          yAxis: [{
            type: 'value',
            scale: true,
            //splitNumber: 1,
            //name: 'Temperatura',
            //min: 0,
            //max: 40,
            position: 'left',
            axisLine: {
              lineStyle: {
                color: '#9A9A9A' //color eje vertical
              }
            },
            axisLabel: {
              formatter: '{value}',
              // margin: 10,
              /*textStyle: {
                fontSize: 12
              }*/
            },
            splitLine: {
              lineStyle: {
                color: '#FFFFFF'
              }
            }
          }],
          series: [{
            name: 'Temp. Interna (°C)',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 2
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(137, 189, 27, 0.3)'
                }, {
                  offset: 0.8,
                  color: 'rgba(137, 189, 27, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: 'rgb(137,189,27)',
                borderColor: 'rgba(137,189,2,0.27)',
                borderWidth: 12

              }
            },
            data: tempInterna
          }, {
            name: 'Hum. Interna (%)',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 2
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(0, 136, 212, 0.1)'
                }, {
                  offset: 0.5,
                  color: 'rgba(0, 136, 212, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.9)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: 'rgb(0,136,212)',
                borderColor: 'rgba(0,136,212,0.2)',
                borderWidth: 12

              }
            },
            //yAxisIndex: 1,
            data: humInterna
          }, {
            name: 'Temp. Externa (°C)',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 2
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(219, 50, 51, 0.1)'
                }, {
                  offset: 0.8,
                  color: 'rgba(219, 50, 51, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.9)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {

                color: 'rgb(219,50,51)',
                borderColor: 'rgba(219,50,51,0.2)',
                borderWidth: 12
              }
            },
            data: tempExterna
          }, {
            name: 'Hum. Externa (%)',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 2
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(255, 233, 43, 0.3)'
                }, {
                  offset: 0.8,
                  color: 'rgba(255, 233, 43, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: 'rgb(255, 233, 43)',
                borderColor: 'rgba(255, 233, 43, 0.27)',
                borderWidth: 12

              }
            },
            //yAxisIndex: 1,
            data: humExterna
          }]
        };
      });
  }

  graphWeight() {

    this.messajeList.length = 0;
    this.messagesService.getDateListQueried('ts', this.year.toISOString())
      .snapshotChanges()
      .subscribe(items => {
        this.messajeList = [];
        items.forEach(elements => {
          const z = elements.payload.toJSON();
          z['$key'] = elements.key;
          this.messajeList.push(z as Message);
        });
        const weight = this.messajeList.map(res => res.weight);
        const date = this.messajeList.map(res => res.ts);
        const dias = [];

        date.forEach(result => {
          const jsDate = new Date(result).toLocaleString('ch');
          dias.push(jsDate);
        });

        this.chartOption1 = {
          backgroundColor: '#FFFFFF',
          textStyle: {
            fontFamily: 'Poppins',
            fontWeight: 300,
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                color: '#57617B' // barra vertical puntero
              }
            },
            textStyle: {
              fontSize: 12,
            },
          },
          legend: { // leyenda
            icon: 'circle',
            align: 'auto',
            //top: 300,
            //itemGap: 20,
            data: ['Peso (Kg)'],
            textStyle: {
              fontSize: 12,
              fontFamily: 'Poppins',
              fontWeight: 200,
              color: '#1d253b'
            },
          },
          grid: {
            left: '1%',
            right: '2%',
            bottom: '20%',
            top: '10%',
            containLabel: true
          },
          dataZoom: [{
            type: 'inside',
            start: 80,
            end: 100
          }, {
            start: 0,
            end: 10,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 3,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }],
          xAxis: [{
            type: 'category',
            show: true,
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#1d253b', // Color letras eje horizontal
                fontWeight: 200,
                fontSize: 12,
              }
            },
            data: dias
          }, {
            axisPointer: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#9A9A9A', // color eje horizontal
              }
            },
            axisTick: {
              show: false
            },
          }],
          yAxis: [{
            type: 'value',
            scale: true,
            //splitNumber: 1,
            //name: 'Temperatura',
            //min: 0,
            //max: 40,
            position: 'left',
            axisLine: {
              lineStyle: {
                color: '#9A9A9A' //color eje vertical
              }
            },
            axisLabel: {
              formatter: '{value}',
              // margin: 10,
              /*textStyle: {
                fontSize: 12
              }*/
            },
            splitLine: {
              lineStyle: {
                color: '#FFFFFF'
              }
            }
          }],
          series: [{
            name: 'Peso (Kg)',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 2
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(137, 189, 27, 0.3)'
                }, {
                  offset: 0.8,
                  color: 'rgba(137, 189, 27, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: 'rgb(137,189,27)',
                borderColor: 'rgba(137,189,2,0.27)',
                borderWidth: 12

              }
            },
            data: weight
          }]
        };
      });
  }

  graphActivity() {

    this.messajeList.length = 0;
    this.messagesService.getDateListQueried('ts', this.year.toISOString())
      .snapshotChanges()
      .subscribe(items => {
        this.messajeList = [];
        items.forEach(elements => {
          const z = elements.payload.toJSON();
          z['$key'] = elements.key;
          this.messajeList.push(z as Message);
        });
        const count = this.messajeList.map(res => res.count);
        const date = this.messajeList.map(res => res.ts);
        const dias = [];

        date.forEach(result => {
          const jsDate = new Date(result).toLocaleString('ch');
          dias.push(jsDate);
        });

        this.chartOption2 = {
          backgroundColor: '#FFFFFF',
          textStyle: {
            fontFamily: 'Poppins',
            fontWeight: 300,
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                color: '#57617B' // barra vertical puntero
              }
            },
            textStyle: {
              fontSize: 12,
            },
          },
          legend: { // leyenda
            icon: 'circle',
            align: 'auto',
            //top: 300,
            //itemGap: 20,
            data: ['Actividad'],
            textStyle: {
              fontSize: 12,
              fontFamily: 'Poppins',
              fontWeight: 200,
              color: '#1d253b'
            },
          },
          grid: {
            left: '1%',
            right: '2%',
            bottom: '20%',
            top: '10%',
            containLabel: true
          },
          dataZoom: [{
            type: 'inside',
            start: 80,
            end: 100
          }, {
            start: 0,
            end: 10,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 3,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }],
          xAxis: [{
            type: 'category',
            show: true,
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#1d253b', // Color letras eje horizontal
                fontWeight: 200,
                fontSize: 12,
              }
            },
            data: dias
          }, {
            axisPointer: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#9A9A9A', // color eje horizontal
              }
            },
            axisTick: {
              show: false
            },
          }],
          yAxis: [{
            type: 'value',
            scale: true,
            //splitNumber: 1,
            //name: 'Temperatura',
            //min: 0,
            //max: 40,
            position: 'left',
            axisLine: {
              lineStyle: {
                color: '#9A9A9A' //color eje vertical
              }
            },
            axisLabel: {
              formatter: '{value}',
              // margin: 10,
              /*textStyle: {
                fontSize: 12
              }*/
            },
            splitLine: {
              lineStyle: {
                color: '#FFFFFF'
              }
            }
          }],
          series: [{
            name: 'Actividad',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 2
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(137, 189, 27, 0.3)'
                }, {
                  offset: 0.8,
                  color: 'rgba(137, 189, 27, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: 'rgb(137,189,27)',
                borderColor: 'rgba(137,189,2,0.27)',
                borderWidth: 12

              }
            },
            data: count
          }]
        };
      });
  }

  getDataGrapDay() {
    this.messajeList.length = 0;
    if (this.LineChart) { this.LineChart.destroy(); }
    this.messagesService.getDateListQueried('ts', this.day.toISOString())
      .snapshotChanges()
      .subscribe(items => {
        this.messajeList = [];
        items.forEach(elements => {
          const z = elements.payload.toJSON();
          z['$key'] = elements.key;
          this.messajeList.push(z as Message);
        });
        const tempInterna = this.messajeList.map(res => res.temp1);
        const humInterna = this.messajeList.map(res => res.hum1);
        const tempExterna = this.messajeList.map(res => res.temp2);
        const humExterna = this.messajeList.map(res => res.hum2);
        const date = this.messajeList.map(res => res.ts);
        const dias = [];

        date.forEach(result => {
          const jsDate = new Date(result).toLocaleString('ch');
          dias.push(jsDate);
        });

        /*this.LineChart = new Chart('lineChart', {
          type: 'line',
          data: {
            labels: dias,
            datasets: [{
              label: 'Temperatura Interna',
              data: tempInterna,
              lineTension: 1,
              backgroundColor: 'rgba(221, 80, 68, 0.5)',
              borderColor: 'rgba(221, 80, 68)',
              borderWidth: 3,
              pointBackgroundColor: 'rgba(221, 80, 68)',
              pointStyle: 'line'
            },
            {
              label: 'Humedad Interna',
              data: humInterna,
              lineTension: 1,
              backgroundColor: 'rgba(0, 122, 204, 0.5)',
              borderColor: 'rgba(0, 122, 204)',
              borderWidth: 0,
              pointBackgroundColor: 'rgba(0, 122, 204)',
              pointStyle: 'line'
            },
            {
              label: 'Temperatura Externa',
              data: tempExterna,
              lineTension: 1,
              backgroundColor: 'rgba(221, 80, 68, 0.5)',
              borderColor: 'rgba(221, 80, 68)',
              borderWidth: 0,
              pointBackgroundColor: 'rgba(221, 80, 68)',
              pointStyle: 'line'
            },
            {
              label: 'Humedad Externa',
              data: humExterna,
              lineTension: 1,
              backgroundColor: 'rgba(255, 206, 68, 0.5)',
              borderColor: 'rgba(255, 206, 68)',
              borderWidth: 0,
              pointBackgroundColor: 'rgba(255, 206, 68)',
              pointStyle: 'line'
            }]
          },
          options: {
            responsive: true,
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  max: 120,
                  min: 0
                }
              }],
              xAxes: [{
                // type: 'time',
                display: false,
                // distribution: 'series'
              }]
            },
            legend: {
              display: true,
              position: 'bottom',
            },
            layout: {
              padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }
            }
          }
        });*/
      });
  }

  getDataGrapWeek() {
    this.messajeList.length = 0;
    if (this.LineChart) { this.LineChart.destroy(); }
    this.messagesService.getDateListQueried('ts', this.week.toISOString())
      .snapshotChanges()
      .subscribe(items => {
        this.messajeList = [];
        items.forEach(elements => {
          const z = elements.payload.toJSON();
          z['$key'] = elements.key;
          this.messajeList.push(z as Message);
        });
        const tempInterna = this.messajeList.map(res => res.temp1);
        const humInterna = this.messajeList.map(res => res.hum1);
        const tempExterna = this.messajeList.map(res => res.temp2);
        const humExterna = this.messajeList.map(res => res.hum2);
        const date = this.messajeList.map(res => res.ts);
        const dias = [];

        date.forEach(result => {
          const jsDate = new Date(result).toLocaleString('ch');
          dias.push(jsDate);
        });
        this.chartOption = {

          backgroundColor: '#FFFFFF',
          textStyle: {
            fontFamily: 'Poppins',
            fontWeight: 300,
          },
          /*title: {
            text: 'CONDICIONES AMBIENTALES', // titulo
            show: false,
            textStyle: {
              fontWeight: 'normal',
              fontSize: 16,
              color: '#000000'
            },
            left: '6%'
          },*/
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                color: '#57617B' // barra vertical puntero
              }
            },
            textStyle: {
              fontSize: 12,
            },
          },
          legend: { // leyenda
            icon: 'circle',
            align: 'auto',
            //top: 300,
            //itemGap: 20,
            data: ['Temp. Interna (°C)', 'Hum. Interna (%)', 'Temp. Externa (°C)', 'Hum. Externa (%)'],
            textStyle: {
              fontSize: 12,
              fontFamily: 'Poppins',
              fontWeight: 200,
              color: '#1d253b'
            },
            selected: {
              // selected'series 1'
              'Temp. Interna (°C)': true,
              'Hum. Interna (%)': false,
              'Temp. Externa (°C)': false,
              'Hum. Externa (%)': false
            }
          },
          grid: {
            left: '1%',
            right: '2%',
            bottom: '20%',
            top: '10%',
            containLabel: true
          },
          dataZoom: [{
            type: 'inside',
            start: 80,
            end: 100
          }, {
            start: 0,
            end: 10,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 3,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }],
          xAxis: [{
            type: 'category',
            show: true,
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#1d253b', // Color letras eje horizontal
                fontWeight: 200,
                fontSize: 12,
              }
            },
            data: dias
          }, {
            axisPointer: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#9A9A9A', // color eje horizontal
              }
            },
            axisTick: {
              show: false
            },
          }],
          yAxis: [{
            type: 'value',
            scale: true,
            //splitNumber: 1,
            //name: 'Temperatura',
            //min: 0,
            //max: 40,
            position: 'left',
            axisLine: {
              lineStyle: {
                color: '#9A9A9A' //color eje vertical
              }
            },
            axisLabel: {
              formatter: '{value}',
              // margin: 10,
              /*textStyle: {
                fontSize: 12
              }*/
            },
            splitLine: {
              lineStyle: {
                color: '#FFFFFF'
              }
            }
          },/*
          {
            type: 'value',
            name: 'Humedad',
            min: 0,
            max: 100,
            position: 'right',
            nameLocation: 'end',
            axisLine: {
                lineStyle: {
                    color: '#9A9A9A'
                }
            },
            axisLabel: {
                formatter: '{value} %'
            },
            splitLine: {
                lineStyle: {
                    color: '#ffffff'
                }
            },
        },*/
          ],
          series: [{
            name: 'Temp. Interna (°C)',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 2
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(137, 189, 27, 0.3)'
                }, {
                  offset: 0.8,
                  color: 'rgba(137, 189, 27, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: 'rgb(137,189,27)',
                borderColor: 'rgba(137,189,2,0.27)',
                borderWidth: 12

              }
            },
            data: tempInterna
          }, {
            name: 'Hum. Interna (%)',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 2
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(0, 136, 212, 0.1)'
                }, {
                  offset: 0.5,
                  color: 'rgba(0, 136, 212, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.9)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: 'rgb(0,136,212)',
                borderColor: 'rgba(0,136,212,0.2)',
                borderWidth: 12

              }
            },
            //yAxisIndex: 1,
            data: humInterna
          }, {
            name: 'Temp. Externa (°C)',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 2
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(219, 50, 51, 0.1)'
                }, {
                  offset: 0.8,
                  color: 'rgba(219, 50, 51, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.9)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {

                color: 'rgb(219,50,51)',
                borderColor: 'rgba(219,50,51,0.2)',
                borderWidth: 12
              }
            },
            data: tempExterna
          }, {
            name: 'Hum. Externa (%)',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 2
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(255, 233, 43, 0.3)'
                }, {
                  offset: 0.8,
                  color: 'rgba(255, 233, 43, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: 'rgb(255, 233, 43)',
                borderColor: 'rgba(255, 233, 43, 0.27)',
                borderWidth: 12

              }
            },
            //yAxisIndex: 1,
            data: humExterna
          }]

        };

        /*this.LineChart = new Chart('lineChart', {
          type: 'line',
          data: {
            labels: dias,
            datasets: [{
              label: 'Temperatura Interna',
              fill: true,
              // lineTension: 0,
              backgroundColor: 'transparent',
              borderColor: '#d048b6',
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,

              pointRadius: 0,
              // pointBackgroundColor: 'rgba(221, 80, 68)',
              // pointStyle: 'line',
              data: tempInterna,
            },
            {
              label: 'Humedad Interna',
              data: humInterna,
              lineTension: 0,
              backgroundColor: 'transparent',
              borderColor: 'rgba(0, 188, 228)',
              borderWidth: 0,
              pointBackgroundColor: 'rgba(0, 122, 204)',
              pointStyle: 'line'
            },
            {
              label: 'Temperatura Externa',
              data: tempExterna,
              lineTension: 0,
              backgroundColor: 'transparent',
              borderColor: 'rgba(122, 193, 67)',
              borderWidth: 0,
              pointBackgroundColor: 'rgba(221, 80, 68)',
              pointStyle: 'line'
            },
            {
              label: 'Humedad Externa',
              data: humExterna,
              lineTension: 0,
              backgroundColor: 'transparent',
              borderColor: 'rgba(210, 9, 8)',
              borderWidth: 0,
              pointBackgroundColor: 'rgba(255, 206, 68)',
              pointStyle: 'line'
            }]
          },
          options: {
            maintainAspectRatio: true,
            responsive: true,
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  max: 120,
                  min: 0
                }
              }],
              xAxes: [{
                // type: 'time',
                display: false,
                // distribution: 'series'
              }]
            },
            legend: {
              display: true,
              position: 'bottom',
            },
            layout: {
              padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }
            }
          }
        });*/
      });
  }

  getDataGrapMonth() {
    this.messajeList.length = 0;
    if (this.LineChart) { this.LineChart.destroy(); }
    this.messagesService.getDateListQueried('ts', this.month.toISOString())
      .snapshotChanges()
      .subscribe(items => {
        this.messajeList = [];
        items.forEach(elements => {
          const z = elements.payload.toJSON();
          z['$key'] = elements.key;
          this.messajeList.push(z as Message);
        });
        const tempInterna = this.messajeList.map(res => res.temp1);
        const humInterna = this.messajeList.map(res => res.hum1);
        const tempExterna = this.messajeList.map(res => res.temp2);
        const humExterna = this.messajeList.map(res => res.hum2);
        const date = this.messajeList.map(res => res.ts);
        const dias = [];

        date.forEach(result => {
          const jsDate = new Date(result).toLocaleString('ch');
          dias.push(jsDate);
        });

        /*this.LineChart = new Chart('lineChart', {
          type: 'line',
          data: {
            labels: dias,
            datasets: [{
              label: 'Temperatura Interna',
              data: tempInterna,
              lineTension: 1,
              backgroundColor: 'rgba(221, 80, 68, 0.5)',
              borderColor: 'rgba(221, 80, 68)',
              borderWidth: 0,
              pointBackgroundColor: 'rgba(221, 80, 68)',
              pointStyle: 'line'
            },
            {
              label: 'Humedad Interna',
              data: humInterna,
              lineTension: 1,
              backgroundColor: 'rgba(0, 122, 204, 0.5)',
              borderColor: 'rgba(0, 122, 204)',
              borderWidth: 0,
              pointBackgroundColor: 'rgba(0, 122, 204)',
              pointStyle: 'line'
            },
            {
              label: 'Temperatura Externa',
              data: tempExterna,
              lineTension: 1,
              backgroundColor: 'rgba(221, 80, 68, 0.5)',
              borderColor: 'rgba(221, 80, 68)',
              borderWidth: 0,
              pointBackgroundColor: 'rgba(221, 80, 68)',
              pointStyle: 'line'
            },
            {
              label: 'Humedad Externa',
              data: humExterna,
              lineTension: 1,
              backgroundColor: 'rgba(255, 206, 68, 0.5)',
              borderColor: 'rgba(255, 206, 68)',
              borderWidth: 0,
              pointBackgroundColor: 'rgba(255, 206, 68)',
              pointStyle: 'line'
            }]
          },
          options: {
            responsive: true,
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  max: 120,
                  min: 0
                }
              }],
              xAxes: [{
                // type: 'time',
                display: false,
                // distribution: 'series'
              }]
            },
            legend: {
              display: true,
              position: 'bottom',
            },
            layout: {
              padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }
            }
          }
        });*/
      });
  }

  getDataGrapYear() {
    this.messajeList.length = 0;
    if (this.LineChart) { this.LineChart.destroy(); }
    this.messagesService.getDateListQueried('ts', this.year.toISOString())
      .snapshotChanges()
      .subscribe(items => {
        this.messajeList = [];
        items.forEach(elements => {
          const z = elements.payload.toJSON();
          z['$key'] = elements.key;
          this.messajeList.push(z as Message);
        });
        const tempInterna = this.messajeList.map(res => res.temp1);
        const humInterna = this.messajeList.map(res => res.hum1);
        const tempExterna = this.messajeList.map(res => res.temp2);
        const humExterna = this.messajeList.map(res => res.hum2);
        const date = this.messajeList.map(res => res.ts);
        const dias = [];

        date.forEach(result => {
          const jsDate = new Date(result).toLocaleString('ch');
          dias.push(jsDate);
        });

        /*this.LineChart = new Chart('lineChart', {
          type: 'line',
          data: {
            labels: dias,
            datasets: [{
              label: 'Temperatura Interna',
              data: tempInterna,
              lineTension: 1,
              backgroundColor: 'rgba(221, 80, 68, 0.5)',
              borderColor: 'rgba(221, 80, 68)',
              borderWidth: 0,
              pointBackgroundColor: 'rgba(221, 80, 68)',
              pointStyle: 'line'
            },
            {
              label: 'Humedad Interna',
              data: humInterna,
              lineTension: 1,
              backgroundColor: 'rgba(0, 122, 204, 0.5)',
              borderColor: 'rgba(0, 122, 204)',
              borderWidth: 0,
              pointBackgroundColor: 'rgba(0, 122, 204)',
              pointStyle: 'line'
            },
            {
              label: 'Temperatura Externa',
              data: tempExterna,
              lineTension: 1,
              backgroundColor: 'rgba(221, 80, 68, 0.5)',
              borderColor: 'rgba(221, 80, 68)',
              borderWidth: 0,
              pointBackgroundColor: 'rgba(221, 80, 68)',
              pointStyle: 'line'
            },
            {
              label: 'Humedad Externa',
              data: humExterna,
              lineTension: 1,
              backgroundColor: 'rgba(255, 206, 68, 0.5)',
              borderColor: 'rgba(255, 206, 68)',
              borderWidth: 0,
              pointBackgroundColor: 'rgba(255, 206, 68)',
              pointStyle: 'line'
            }]
          },
          options: {
            responsive: true,
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  max: 120,
                  min: 0
                }
              }],
              xAxes: [{
                display: false,
              }]
            },
            legend: {
              display: true,
              position: 'bottom',
            },
            layout: {
              padding: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
              }
            }
          }
        });*/
      });
  }
}

/*

  dataMonth() {
    this.messajeList.length = 0;
    this.tempInterna = [];
    this.humInterna = [];
    this.tempExterna = [];
    this.humExterna = [];
    this.dias = [];
    this.messagesService.getDateListQueried('ts', this.month.toISOString())
      .snapshotChanges()
      .subscribe(items => {
        this.messajeList = [];
        items.forEach(elements => {
          const z = elements.payload.toJSON();
          z['$key'] = elements.key;
          this.messajeList.push(z as Message);
        });
        this.tempInterna = this.messajeList.map(res => res.temp1);
        this.humInterna = this.messajeList.map(res => res.hum1);
        this.tempExterna = this.messajeList.map(res => res.temp2);
        this.humExterna = this.messajeList.map(res => res.hum2);
        const date = this.messajeList.map(res => res.ts);
        console.log(this.tempInterna);

        date.forEach(result => {
          const jsDate = new Date(result).toLocaleString('ch');
          this.dias.push(jsDate);
        });
        this.LineChart.update();
      });

    console.log(this.tempInterna);
  }

  dataYear() {
    this.messajeList.length = 0;
    this.tempInterna = [];
    this.humInterna = [];
    this.tempExterna = [];
    this.humExterna = [];
    this.dias = [];
    this.messagesService.getDateListQueried('ts', this.year.toISOString())
      .snapshotChanges()
      .subscribe(items => {
        this.messajeList = [];
        items.forEach(elements => {
          const z = elements.payload.toJSON();
          z['$key'] = elements.key;
          this.messajeList.push(z as Message);
        });
        this.tempInterna = this.messajeList.map(res => res.temp1);
        this.humInterna = this.messajeList.map(res => res.hum1);
        this.tempExterna = this.messajeList.map(res => res.temp2);
        this.humExterna = this.messajeList.map(res => res.hum2);
        const date = this.messajeList.map(res => res.ts);
        console.log(this.tempInterna);

        date.forEach(result => {
          const jsDate = new Date(result).toLocaleString('ch');
          this.dias.push(jsDate);
        });
        this.LineChart.update();
      });

    console.log(this.tempInterna);
  }

  graph() {
    this.LineChart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: this.dias,
        datasets: [{
          label: 'Temperatura Interna',
          data: this.tempInterna,
          lineTension: 1,
          backgroundColor: 'rgba(221, 80, 68, 0.5)',
          borderColor: 'rgba(221, 80, 68)',
          borderWidth: 3,
          pointBackgroundColor: 'rgba(221, 80, 68)',
          pointStyle: 'line'
        },
        {
          label: 'Humedad Interna',
          data: this.humInterna,
          lineTension: 1,
          backgroundColor: 'rgba(0, 122, 204, 0.5)',
          borderColor: 'rgba(0, 122, 204)',
          borderWidth: 0,
          pointBackgroundColor: 'rgba(0, 122, 204)',
          pointStyle: 'line'
        },
        {
          label: 'Temperatura Externa',
          data: this.tempExterna,
          lineTension: 1,
          backgroundColor: 'rgba(221, 80, 68, 0.5)',
          borderColor: 'rgba(221, 80, 68)',
          borderWidth: 0,
          pointBackgroundColor: 'rgba(221, 80, 68)',
          pointStyle: 'line'
        },
        {
          label: 'Humedad Externa',
          data: this.humExterna,
          lineTension: 1,
          backgroundColor: 'rgba(255, 206, 68, 0.5)',
          borderColor: 'rgba(255, 206, 68)',
          borderWidth: 0,
          pointBackgroundColor: 'rgba(255, 206, 68)',
          pointStyle: 'line'
        }]
      },
      options: {
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              max: 120,
              min: 0
            }
          }],
          xAxes: [{
            // type: 'time',
            display: false,
            // distribution: 'series'
          }]
        },
        legend: {
          display: true,
        },
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        }
      }
    });
  }*/


