/** ==================================== **/
/**              FRAMEWORK               **/
/** ==================================== **/

$(document).ready(function () {

  $('.search-icon .fa-times').hide();

  $('.search-icon .fa-times').click(function () {
    $('#input').val('');
    onValueChange();
  });

  $('#input').bind('input', function () {
    onValueChange();
  });
});

function onValueChange() {
  var inputValue = $('#input').val();

  if (inputValue) {
    $('.search-icon .fa-times').show();
    $('.search-icon .fa-keyboard-o').hide();
  }
  else {
    $('.search-icon .fa-times').hide();
    $('.search-icon .fa-keyboard-o').show();
  }

  updateNumbersTable(inputValue);
  updateCharTable(inputValue);
}

function updateNumbersTable(inputValue) {
  $('#output-numbers').empty();
  if (!inputValue)
    return;

  var numbers = extractNumbers(inputValue);

  appendNumberRow('Numbers', numbers, empty);
  appendNumberRow('Number', numbers, identity);
  appendNumberRow('Position', numbers, position);

  appendNumberHeading('Numeral system');
  appendNumberRow('Binary (2)', numbers, toBinary);
  appendNumberRow('Octal (8)', numbers, toOctal);
  appendNumberRow('Hex (16)', numbers, toHex);
  appendNumberRow('Roman', numbers, romanize);

  appendNumberHeading('Miscellaneous');
  appendNumberRow('ASCII', numbers, numberToAscii);
  appendNumberRow('Alphabet (A = 1)', numbers, numberToLetter);
  appendNumberRow('QS', numbers, digitSum);
  appendNumberRow('IQS', numbers, digitalRoot);

  addNumberCalculationColumns();

  $('#output-numbers .heading td').attr('colspan', $('#output-numbers tr:nth-child(2) td').length);
}

function appendNumberRow(description, input, func) {
  var output = '<tr><td>' + description + '</td>';
  for (var i = 0; i < input.length; i++) {
    output += '<td>' + func(input[i], i) + '</td>';
  }
  output += '</tr>';

  $('#output-numbers').append(output);
}

function updateCharTable(inputValue) {
  $('#output-characters').empty();
  if (!inputValue)
    return;

  appendCharRow('Characters', inputValue, empty);
  appendCharRow('Input', inputValue, identity);
  appendCharRow('Position', inputValue, position);
  appendCharRow('ASCII', inputValue, charToAscii);

  appendCharHeading('Alphabet');
  appendCharRow('Alphabet (A = 0)', inputValue, alphabetIndexZero);
  appendCharRow('Alphabet (A = 1)', inputValue, alphabetIndexOne);
  appendCharRow('Alphabet (A = 25)', inputValue, alphabetIndexReverseZero);
  appendCharRow('Alphabet (A = 26)', inputValue, alphabetIndexReverseOne);

  appendCharHeading('Caesar cipher');
  for (var i = 1; i < 26; i++) {
    appendCaesarRow(i, inputValue);
  }

  appendCharHeading('Miscellaneous');
  appendCharRow('SMS code', inputValue, function (value) {
    return mapCode(value, smsMap);
  });

  addCharCalculationColumns();

  $('#output-characters .heading td').attr('colspan', $('#output-characters tr:nth-child(2) td').length);
}

function appendCharRow(description, input, func) {
  var output = '<tr><td>' + description + '</td>';
  for (var i = 0; i < input.length; i++) {
    output += '<td>' + func(input.charAt(i), i) + '</td>';
  }
  output += '</tr>';

  $('#output-characters').append(output);
}

function appendCaesarRow(offset, inputValue) {
  appendCharRow('Caesar (' + offset + ')', inputValue, function (value) {
    return caesar(value, offset);
  });
}

function appendNumberHeading(heading) {
  appendHeading('#output-numbers', heading);
}

function appendCharHeading(heading) {
  appendHeading('#output-characters', heading);
}

function appendHeading(elem, heading) {
  var output = '<tr class="heading"><td>' + heading + '</td></tr>';
  $(elem).append(output);
}

function mapCode(value, map) {
  if (map[value.toLowerCase()]) {
    return map[value.toLowerCase()];
  }
  else {
    return '';
  }
}

function addNumberCalculationColumns() {
  addCalculationColumns('#output-numbers');
}

function addCharCalculationColumns() {
  addCalculationColumns('#output-characters');
}

function addCalculationColumns(elem) {
  $(elem).find('tr:first').each(function () {
    $(this).append('<td class="break-cell"></td>');
    $(this).append('<td>+</td>');
    $(this).append('<td>QS</td>');
    $(this).append('<td>IQS</td>');
  });

  $(elem).find('tr:not(:first)').not('.heading').each(function () {
    var sum = 0;

    $(this).find('td').each(function () {
      sum += parseInt($(this).text()) || 0;
    });

    var qs = digitSum(sum);
    var iqs = digitalRoot(sum);

    $(this).append('<td class="break-cell"></td>');
    $(this).append('<td>' + (sum === 0 ? '' : sum) + '</td>');
    $(this).append('<td>' + (qs === 0 ? '' : qs) + '</td>');
    $(this).append('<td>' + (iqs === 0 ? '' : iqs) + '</td>');
  });
}

function clearOnEscape(event, self) {
  if (event.keyCode == 27)
    self.value = '';
}

/** ==================================== **/
/**                  UTILS               **/
/** ==================================== **/

function isLetter(value) {
  var asciiValue = charToAscii(value.toLowerCase());
  return asciiValue >= charToAscii('a') && asciiValue <= charToAscii('z');
}

function isNumber(value) {
  var asciiValue = charToAscii(value.toLowerCase());
  return asciiValue >= charToAscii('0') && asciiValue <= charToAscii('9');
}

function digitSum(number) {
  var sum = number % 10;
  if (number >= 10) {
    var rest = Math.floor(number / 10);
    sum += digitSum(rest);
  }
  return sum;
}

function digitalRoot(number) {
  var sum = digitSum(number);
  if (sum / 10 >= 1) {
    return digitalRoot(sum);
  }
  return sum;
}

function extractNumbers(string) {
  var match = string.match(/[0-9]+/g);
  if (match) {
    return match.map(function (n) {
      return +(n);
    });
  }
  return [];
}

/** ==================================== **/
/**                 MAPS                 **/
/** ==================================== **/

var smsMap = {};
smsMap['a'] = smsMap['b'] = smsMap['c'] = smsMap['2'] = 2;
smsMap['d'] = smsMap['e'] = smsMap['f'] = smsMap['3'] = 3;
smsMap['g'] = smsMap['h'] = smsMap['i'] = smsMap['4'] = 4;
smsMap['j'] = smsMap['k'] = smsMap['l'] = smsMap['5'] = 5;
smsMap['m'] = smsMap['n'] = smsMap['o'] = smsMap['6'] = 6;
smsMap['p'] = smsMap['q'] = smsMap['r'] = smsMap['s'] = smsMap['7'] = 7;
smsMap['t'] = smsMap['u'] = smsMap['v'] = smsMap['8'] = 8;
smsMap['w'] = smsMap['x'] = smsMap['y'] = smsMap['z'] = smsMap['9'] = 9;
smsMap['0'] = 0;
smsMap['1'] = 1;

/** ==================================== **/
/**          DECODING FUNCTIONS          **/
/** ==================================== **/

/**
 * Returns empty values.
 */
function empty() {
  return '';
}

/** Identity function for the first row */
function identity(value) {
  return value;
}

/** Index of the symbol */
function position(value, zeroBasedIndex) {
  return zeroBasedIndex + 1;
}

/** Returns the ASCII representation for a character */
function charToAscii(char) {
  return char.charCodeAt(0);
}

/** Returns the ASCII representation for a number */
function numberToAscii(number) {
  return String.fromCharCode(number);
}

/** Returns the index in the alphabet (zero based) */
function alphabetIndexZero(value) {
  return alphabetIndex(value, 0);
}

/** Returns the index in the alphabet (one based) */
function alphabetIndexOne(value) {
  return alphabetIndex(value, 1);
}

/** Returns the index in the reverse alphabet (zero based) */
function alphabetIndexReverseZero(value) {
  var index = alphabetIndexZero(value);
  return index === '' ? '' : 25 - index;
}

/** Returns the index in the reverse alphabet (one based) */
function alphabetIndexReverseOne(value) {
  var index = alphabetIndexZero(value);
  return index === '' ? '' : 26 - index;
}

function alphabetIndex(value, offset) {
  if (!isLetter(value))
    return '';
  return charToAscii(value.toLowerCase()) - 97 + offset;
}

/** Returns the nth letter of the alphabet */
function numberToLetter(number) {
  var char = numberToAscii(96 + number).toLowerCase();
  if (char >= 'a' && char <= 'z')
    return char;
  return '';
}

/** Returns the binary representation of a number */
function toBinary(number) {
  return number.toString(2);
}

/** Returns the ocatal representation of a number */
function toOctal(number) {
  return number.toString(8);
}

/** Returns the hex representation of a number */
function toHex(number) {
  return number.toString(16);
}

/** Returns the roman numeral for a number. Based on:
 * http://blog.stevenlevithan.com/archives/javascript-roman-numeral-converter
 */
function romanize(num) {
  if (!+num || num > 10000)
    return '';
  var digits = String(+num).split(''),
      key = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM',
        '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC',
        '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'],
      roman = '',
      i = 3;
  while (i--)
    roman = (key[+digits.pop() + (i * 10)] || '') + roman;
  return new Array(+digits.join('') + 1).join('M') + roman;
}

/** Returns the caesar decryption of a letter */
function caesar(value, offset) {
  var asciiValue = charToAscii(value.toLowerCase());
  if (!isLetter(value))
    return '';
  var newAsciiValue = asciiValue + offset;
  newAsciiValue = (newAsciiValue > 122) ? newAsciiValue - 26 : newAsciiValue;
  return String.fromCharCode(newAsciiValue);
}