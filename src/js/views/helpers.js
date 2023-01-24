// Helper function re-used trough project

// Import Timeout seconds
import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './../config.js';

// If Fetch API takes too long, Reject
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// AJAX (get JSON & send JSON)
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    // Fetch api before 10 sec
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    // Get data
    const data = await res.json();
    // Check for errors
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    // Delegate error
    throw err;
  }
};

/*

// Get JSON
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    // Fetch api before 10 sec
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    // Get data
    const data = await res.json();
    // Check for errors
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    // Delegate error
    throw err;
  }
};

// Send JSON
export const sendJSON = async function (url, uploadData) {
  try {
    // When sending add options
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    // Fetch api before 10 sec
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    // Get data
    const data = await res.json();
    // Check for errors
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    // Delegate error
    throw err;
  }
};

*/

// Insted of Fractions
export const numberToFraction = function (amount) {
  // This is a whole number and doesn't need modification.
  if (parseFloat(amount) === parseInt(amount)) {
    return amount;
  }
  // Next 12 lines are cribbed from https://stackoverflow.com/a/23575406.
  const gcd = function (a, b) {
    if (b < 0.0000001) {
      return a;
    }
    return gcd(b, Math.floor(a % b));
  };
  const len = amount.toString().length - 2;
  let denominator = Math.pow(10, len);
  let numerator = amount * denominator;
  var divisor = gcd(numerator, denominator);
  numerator /= divisor;
  denominator /= divisor;
  let base = 0;
  // In a scenario like 3/2, convert to 1 1/2
  // by pulling out the base number and reducing the numerator.
  if (numerator > denominator) {
    base = Math.floor(numerator / denominator);
    numerator -= base * denominator;
  }
  amount = Math.floor(numerator) + '/' + Math.floor(denominator);
  if (base) {
    amount = base + ' ' + amount;
  }
  return amount;
};
