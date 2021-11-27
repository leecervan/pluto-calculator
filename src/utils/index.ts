const keysNumber = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const keysOperator = ['+', '-', '*', '/', '%'];

export const isKeyNumber = (x: string) => keysNumber.includes(x);

export const isKeyOperator = (x: string) => keysOperator.includes(x);

export const isKeyPoint = (x: string) => x === '.';

export const isKeyClear = (x: string) => x === 'AC';

export const isKeyEqual = (x: string) => x === '=';

/**
 * 检测括号：
 * -1：非法 )
 * 0：合法
 * 1：非法 (
 * @param formula 公式
 * @returns
 */
export const validateBrackets = (formula: string) => {
  let cnt = 0;
  for (const x of formula) {
    if (x === '(') cnt++;
    if (x === ')') cnt--;
    if (cnt < 0) return -1;
  }
  return cnt === 0 ? 0 : 1;
};

/**
 * 检测下一个字符是否能够添加到 formula
 * @param formula 公式
 * @param x 下一个字符
 */
export const isValidSymbolAppended = (formula: string, x: string) => {
  if (formula === '') {
    // 开头只能是数字、正负号、左括号
    return keysNumber.includes(x) || x === '+' || x === '-' || x === '(';
  } else {
    const tail = formula[formula.length - 1];
    if (isKeyNumber(tail)) {
      // 数字后面可以追加任何符号，但要检测括号
      return validateBrackets(formula + x) >= 0;
    } else if (tail === '(') {
      // 只能追加数字
      return isKeyNumber(x);
    } else if (tail === ')') {
      // 只能追加运算符
      return isKeyOperator(x);
    } else if (tail === '.') {
      // 只能追加数字
      return isKeyNumber(x);
    } else if (isKeyOperator(tail)) {
      // 运算符后面只能追加数字
      return isKeyNumber(x) || x === '(';
    }
  }
  return false;
};

/**
 * 检测 formula 是否合法
 * @param formula 公式
 */
export const isValidFormula = (formula: string) => {
  if (formula === '') return true;

  // 检测括号是否全部匹配
  if (validateBrackets(formula) !== 0) return false;

  // 检测是否有 0 作为除数

  // 检测是否有无效结尾
  const tail = formula[formula.length - 1];
  if (isKeyOperator(tail) || tail === '(' || tail === '.') return false;

  return true;
};

// 初步计算，后续可能增加新的算法而不是使用不稳定的 eval
export const calc = (formula: string) => eval(formula);
