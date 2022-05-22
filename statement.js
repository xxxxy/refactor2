
    let createStatementData = require('./createStatement');

    let plainStatement = function statement(invoice, plays) {
        return renderPlainText(createStatementData.createStatement(invoice, plays));
    }
    let htmlStatement = function htmlStatement(invoice, plays) {
        return renderHtml(createStatementData.createStatement(invoice, plays));
    }

    //提取主方法
    function renderPlainText(data) {
        let reuslt = `Statement for ${data.customer}\n`;
        for (let perf of data.performances) {
            reuslt += `${perf.play.name}:${usd(perf.amount)} (${perf.audience} seats) \n`;
        }

        reuslt += `Amount owned is ${usd(data.totalAmount)}\n`;
        reuslt += `You earned ${data.totalVolumeCredits} credits \n`;
        return reuslt;
    }

    //添加html渲染方法
    function renderHtml(data) {
        let result = `<h1>Statement for ${data.customer}</h1>\n`;
        result += "<table>\n";
        result += "<tr><th>play</th><th>seats</th><th>cost</th></tr>";
        for (let perf of data.performances) {
            result += `<tr><td>${perf.play.name}</td><td>${usd(perf.amount)}</td><td>${perf.audience}</td></tr> \n`;
        }
        result += "</table>\n";
        result += `<p>Amount owned is ${usd(data.totalAmount)}</p>\n`;
        result += `<p>You earned ${data.totalVolumeCredits} credits</p> \n`;
        return result;
    }

    //抽取格式化方法
    function usd(aNumber) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2
        }).format(aNumber / 100);
    }

    exports.plain = plainStatement;
    exports.html = htmlStatement;