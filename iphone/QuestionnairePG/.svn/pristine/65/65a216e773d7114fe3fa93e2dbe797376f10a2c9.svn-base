// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('optionRadar'));

// 指定图表的配置项和数据
var optionRadar = {
    title: {
        text: '教师专业发展得分情况'
    },
    tooltip: {},
    legend: {
        // data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）']
    },
    radar: {
        // shape: 'circle',
        radius:'60%',
        name: {
            textStyle: {
                /*color: '#fff',*/
                /*backgroundColor: '#999',*/
                color: '#999',
                borderRadius: 3,
                padding: [3, 5]
            }
        },
        nameGap:-25,
        indicator: [
            { name: '学习和学习者', max: 6500},
            { name: '专业发展和价值观', max: 16000},
            { name: '语言知识和意识', max: 32000},
            { name: '语言能力', max: 37000},
            { name: '教学、学习和测评', max: 38000}
        ]
    },
    series: [{
        name: '专业发展 vs 得分',
        type: 'radar',

        // areaStyle: {normal: {}},
        data : [
            {
                value : [4300, 10000, 28000, 35000, 36000],
                name : '专业发展'
            }/*,
            {
                value : [5000, 14000, 28000, 31000, 35000],
                name : '得分'
            }*/
        ]
    }]
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(optionRadar);


// 基于准备好的dom，初始化echarts实例
var myCake = echarts.init(document.getElementById('optionCake'));

// 指定图表的配置项和数据
var optionCake = {
    title: {
        text: '某站点用户访问来源',
        x: 'left',
        top:10
    },
    // tooltip: {
    //     trigger: 'item',
    //     formatter: "{a} <br/>{b} : {c} ({d}%)"
    // },
    legend: {
        // orient: 'vertical',
        // left: 'left'
        // data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
    },
    series: [
        {
            name: '访问来源',
            type: 'pie',
            radius: '60%',
            center: ['50%', '55%'],
            data: [
                {value: 335, name: '直接访问'},
                {value: 310, name: '邮件营销'},
                {value: 234, name: '联盟广告'},
                {value: 135, name: '视频广告'},
                {value: 1548, name: '搜索引擎'}
            ],
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

// 使用刚指定的配置项和数据显示图表。
myCake.setOption(optionCake);



