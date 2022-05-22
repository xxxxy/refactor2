let plays = require('./plays.json');

function createStatementData(invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return statementData;
}


//中转变量
function enrichPerformance(aPerformance) {
    const calculator = new createPerformanceCalculator(aPerformance, playFor(aPerformance));
    const result = Object.assign({}, aPerformance);
    result.play = playFor(result);
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result;
}

//普通函数
function createPerformanceCalculator(aPerformance, aPlay) {
    switch (aPlay.type) {
        case "tragedy":
            return new TragedyCalculator(aPerformance, aPlay);
        case "comedy":
            return new ComedyCalculator(aPerformance, aPlay);
        default:
            throw new Error(`unkown type :${aPlay.type}`);
    }
}

//移除play参数
function amountFor(aPerformance) {
    return new PerformanceCalculator(aPerformance, playFor(aPerformance)).amount;
}

//抽取play方法
function playFor(aPerformance) {
    return plays[aPerformance.playId];
}

//提炼积分计算逻辑
function volumeCreditsFor(aPerformance) {
    return new PerformanceCalculator(aPerformance, playFor(aPerformance)).volumeCredits;
}

//提取计算积分逻辑
function totalVolumeCredits(data) {
    return data.performances.reduce((total, currency) => total + currency.volumeCredits, 0)
}

//提取计算总金额逻辑
function totalAmount(data) {
    return data.performances.reduce((total, currency) => total + currency.amount, 0);
}

exports.createStatement = createStatementData;

//创建演出计算器类
class PerformanceCalculator {
    constructor(aPerformance, play) {
        this.aPerformance = aPerformance;
        this.play = play;
    }

    get amount() {
        throw new Error('子类实现');
    }

    get volumeCredits() {
        return Math.max(this.aPerformance.audience - 30, 0);
    }
}
//悲剧计算器类
class TragedyCalculator extends PerformanceCalculator {
    get amount() {
        let result = 40000;
        if (this.aPerformance.audience > 30) {
            result += 1000 * (this.aPerformance.audience - 30);
        }
        return result;
    }
}

//喜剧计算器类
class ComedyCalculator extends PerformanceCalculator {
    get amount() {
        let result = 30000;
        if (this.aPerformance.audience > 20) {
            result += 10000 + 500 * (this.aPerformance.audience - 20);
        }
        result += 300 * this.aPerformance.audience;
        return result;
    }

    get volumeCredits() {
        return super.volumeCredits + Math.floor(this.aPerformance.audience / 5);
    }
}
