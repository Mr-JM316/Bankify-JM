'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Geeta Asoodani',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Junaid Mohiyuddin',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Fatima Anjum',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Samra Fatima',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {

  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
      <div class="movements__type movements__type--${type}" >${i + 1}${type}</div >
      <div class="movements__value">${mov}</div>
      </div>
      `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });

};


const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);
console.log(accounts);

const calcPrintBalance = function (acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  acc.balance = balance;
  labelBalance.textContent = `${balance} EUR`;

};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}EURO`;

  const out = acc.movements.filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}EURO`;

  const interests = acc.movements.filter(mov => mov > 0)
    .map(deposit => deposit * acc.interestRate / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interests}EURO`;
}

const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcPrintBalance(acc);
  calcDisplaySummary(acc);

}

let CurrentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  CurrentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)

  console.log(CurrentAccount);
  if (CurrentAccount?.pin === Number(inputLoginPin.value))
    console.log('LOGIN'); {
    labelWelcome.textContent = `Welcome Back ${CurrentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUI(CurrentAccount);


  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiveracc = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';

  console.log(amount, receiveracc);

  if (amount > 0 && CurrentAccount.balance >= amount && receiveracc?.username !== CurrentAccount.username) {
    CurrentAccount.movements.push(-amount);
    receiveracc.movements.push(amount);
    updateUI(CurrentAccount);
  }
});
inputLoanAmount.value = '';
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && CurrentAccount.movements.some(mov => mov >= amount * 0.1)) {
    CurrentAccount.movements.push(amount);
    updateUI(CurrentAccount);
  }
});


btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (inputCloseUsername.value === CurrentAccount.username && inputClosePin.value === CurrentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === CurrentAccount.username);


    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
});
inputClosePin.value = inputCloseUsername.value = '';

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(CurrentAccount.movements, !sorted);
  sorted = !sorted;

});



/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES



/////////////////////////////////////////////////

