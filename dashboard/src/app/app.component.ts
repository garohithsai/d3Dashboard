import { Component, OnInit } from '@angular/core';
import { lollipopChartD3 } from '../js/lollipop-plugin-structure';
import { lineChartD3 } from '../js/linechart-plugin-structure';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'dashboard';
  singleObj = [{
    data: [{
      'sale': '202',
      'year': '2000'
    }, {
      'sale': '215',
      'year': '2001'
    }, {
      'sale': '179',
      'year': '2002'
    }, {
      'sale': '199',
      'year': '2003'
    }, {
      'sale': '134',
      'year': '2003'
    }, {
      'sale': '176',
      'year': '2010'
    }]
  }];
  multiObj = [{
    data: [{
      'sale': '202',
      'year': '2000'
    }, {
      'sale': '215',
      'year': '2001'
    }, {
      'sale': '179',
      'year': '2002'
    }, {
      'sale': '199',
      'year': '2003'
    }, {
      'sale': '134',
      'year': '2003'
    }, {
      'sale': '176',
      'year': '2010'
    }]
  }, {
    data: [{
      'sale': '152',
      'year': '2000'
    }, {
      'sale': '189',
      'year': '2002'
    }, {
      'sale': '179',
      'year': '2004'
    }, {
      'sale': '199',
      'year': '2006'
    }, {
      'sale': '134',
      'year': '2008'
    }, {
      'sale': '176',
      'year': '2010'
    }]
  }, {
    data: [{
      'sale': '162',
      'year': '2000'
    }, {
      'sale': '139',
      'year': '2002'
    }, {
      'sale': '119',
      'year': '2004'
    }, {
      'sale': '229',
      'year': '2006'
    }, {
      'sale': '134',
      'year': '2008'
    }, {
      'sale': '206',
      'year': '2010'
    }]
  }];
  lineChartconfigData = {
    xField: 'year',
    yField: 'sale',
    chartTitle: 'D3 Single Line Chart',
    chartTitleColor: '#A584A4',
    listGroup: { axis: 'y', data: ['valueA', 'valueB', 'valueC'] },
    tooltip: true,
    zoom: true,
    backgroundColor: '',
    backgroundImage: '../assets/img.jpeg',
    dottedGraph: false,
    dottedAxis: false,
    axisInfo: {
      xAxis: [{
        title: 'Year1',
        color: '#9433FF',
        lineColor: '#9433FF'
      }, {
        title: 'Year2',
        color: '#B03A2E',
        lineColor: '#B03A2E'
      }, {
        title: 'Year3',
        color: '#34495E',
        lineColor: '#34495E'
      }],
      yAxis: [{
        title: 'Sale',
        color: '#570D54'
      }]
    }
  };
  chartsView: string;


  ngOnInit() {
    var jsonObj = [];
    var gdpGrowthRate = [
                          {country: 'India', gdpgrowth: 7.257},
                          {country: 'Ethiopia', gdpgrowth: 7.723},
                          {country: 'Nepal', gdpgrowth: 6.536},
                          {country: 'Egypt', gdpgrowth: 5.488},
                          {country: 'Indonesia', gdpgrowth: 5.237},
                          {country: 'Hungary', gdpgrowth: 3.600}
                        ];
    var internetUsers = [{Country: "China", Value: 1131},
                          {Country: "France", Value: 2162},
                          {Country: "Germany (FRG)", Value: 1653},
                          {Country: "Israel", Value: 1263},
                          {Country: "Italy", Value: 660},
                          {Country: "Netherlands", Value: 1167},
                          {Country: "Russia", Value: 6148},
                          {Country: "Spain", Value: 814},
                          {Country: "United Kingdom", Value: 1214},
                          {Country: "United States", Value: 12394}
                        ]
    var configData = {
          horizontal:true,
          sortOrder: true,
          tooltip: true,
          dataSet: [
                    {text: 'Internet Users', value: 'internetUsers'}, 
                    {text: 'GDP Growth Rate', value: 'gdpGrowthRate'}
                   ],
          internetUsers: {
              labels: {xlabel: 'Country', ylabel:'Internet Users'},
              fields: {xField: 'Country', yField: 'Value'}
          },
          rangeField: {field: 'yField'},  //must be a number
          gdpGrowthRate: {
              labels: {xlabel: 'Country', ylabel: 'GDP Growth'},
              fields: {xField: 'country', yField: 'gdpgrowth'}
          }
    };
    this.setDefaultChart();
    lollipopChartD3.actions.drawChart(configData, {gdpGrowthRate: gdpGrowthRate, internetUsers: internetUsers}, '#my_dataviz');
  }

  changeChartView(event) {
    // const selectedVal = 'single';
    const selectedVal = event.target.value;
    if (selectedVal === 'single') {
      this.lineChartconfigData.axisInfo = {
        xAxis: [{
          title: 'Year',
          color: '#9433FF',
          lineColor: '#9433FF'
        }],
        yAxis: [{
          title: 'Sale',
          color: '#570D54'
        }]
      };
      lineChartD3.actions.drawChart(this.lineChartconfigData, this.singleObj, '#my_line_dataviz');
    } else {
      this.lineChartconfigData.axisInfo = {
        xAxis: [{
          title: 'Year1',
          color: '#9433FF',
          lineColor: '#9433FF'
        }, {
          title: 'Year2',
          color: '#B03A2E',
          lineColor: '#B03A2E'
        }, {
          title: 'Year3',
          color: '#34495E',
          lineColor: '#34495E'
        }],
        yAxis: [{
          title: 'Sale',
          color: '#570D54'
        }]
      };
      lineChartD3.actions.drawChart(this.lineChartconfigData, this.multiObj, '#my_line_dataviz');
    }
  }

  setDefaultChart() {
      this.chartsView = 'multiple';
      lineChartD3.actions.drawChart(this.lineChartconfigData, this.multiObj, '#my_line_dataviz');
  }

  openNav() {
       document.getElementById("mySidenav").style.width = "250px";
       document.getElementById("mySidenav").style.position="fixed";
  }
    
  closeNav() {
        document.getElementById("mySidenav").style.width = "0";
  }
      

}
