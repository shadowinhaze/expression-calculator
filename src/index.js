function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {

    function reduci(str) {
      reduciExp = /(\-?\d+(\.\d+)?) ([\/\*]) (\-?\d+(\.\d+)?)/;
      while (reduciExp.test(str)) {
        str = str.replace(reduciExp, (match, p1, p2, p3, p4) => {
          if (p3 == '*') {
            return Number(p1) * Number(p4);
          } else if(p4 == '0') {
            throw new Error('TypeError: Division by zero.')
          } else {
            return Number(p1) / Number(p4);
          }
        })
      }
      return str;
    }
  
    function brackets(str) {
      return str.replace(/\({1}\s{2}[\d+\+\-]*[^\(\)]*\s{2}\){1}/g, match => {
        match = reduci(match)
        return match.split(' ').reduce((sum, item, index, arr) => {
          switch (true) {
            case /\d+/.test(item) && index === 2:
              return sum + Number(item);
              break;
            case item == '+':
              return sum + Number(arr[index + 1]);
              break;
            case item == '-':
              return sum - Number(arr[index + 1]);
              break;
          }
          return sum;
        }, 0);
      })
    }
  
    let simpleTest = /^\s?(\-?\d+)\s?([\+\-\*\/])\s?(\-?\d+)\s?$/;
    let bracketsLeftTest = /\(/g;
    let bracketsRightTest = /\)/g;
  
    switch (true) {
      case expr.includes('(') && expr.includes(')'):
        if (expr.match(bracketsLeftTest).length != expr.match(bracketsRightTest).length) {
          throw new Error('ExpressionError: Brackets must be paired')
        }
        break;
      case expr.includes('(') && !expr.includes(')'):
        throw new Error('ExpressionError: Brackets must be paired')
        break;
      case expr.includes(')') && !expr.includes('('):
        throw new Error('ExpressionError: Brackets must be paired')
        break;
    }
  
    if (simpleTest.test(expr)) {
      expr = expr.replace(simpleTest, (match, p1, p2, p3) => {
        switch (true) {
          case p2 === '+':
            return (Number(p1) + Number(p3)).toFixed(4);
            break;
          case p2 === '-':
            return (Number(p1) - Number(p3)).toFixed(4);
            break;
          case p2 === '*':
            return (Number(p1) * Number(p3)).toFixed(4);
            break;
          case p2 === '/':
            if (p3 == '0') throw new Error('TypeError: Division by zero.')
            return (Number(p1) / Number(p3)).toFixed(4);
            break;
        }
      })
      return +expr
    }
  
    while (/[\(\)]/g.test(expr)) {
      expr = brackets(expr);
    }
    expr = reduci(expr);
  
    expr = expr.split(' ').slice(1, -1).reduce((sum, item, index, arr) => {
      switch (true) {
        case index === 0:
          return sum + Number(item);
          break;
        case item === '+':
          return sum + Number(arr[index + 1]);
          break;
        case item === '-':
          return sum - Number(arr[index + 1]);
          break;
      }
      return sum;
    }, 0);
  
    return +expr.toFixed(4)
  }


module.exports = {
    expressionCalculator
}