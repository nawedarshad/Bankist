'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Nawed Arshad',
  phone: 1234567890,
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,
};

const account2 = {
  owner: 'Rahul Kumar',
  phone: 1122334455,
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Syed Merazul Hassan',
  phone: 9876543210,
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah',
  phone: 5544332211,
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

const inputLoginphone = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputClosephone = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


//welcome
const welcome = function(){
  labelWelcome.innerHTML = "Welcome back";
  containerApp.style.opacity = 100;
}

//login
let current_account;
btnLogin.addEventListener('click', function(e){
  e.preventDefault();                                           //prevent from submitting
  current_account = accounts.find(function(acc){
    if (acc.phone == inputLoginphone.value && acc.pin == inputLoginPin.value) {
      welcome();
      return acc;
    }});
  console.log(current_account);
  displayMovements(current_account);
  logout_timer();
  TransactionType(current_account);
  PrintBalance(current_account);  
});
//Transfer
btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const transfer_to = accounts.find(function(acc){
    if (acc.phone == inputTransferTo.value) {
      if (amount > 0) {
         console.log(amount);
         console.log(acc);
         current_account.movements.push(-amount); 
         acc.movements.push(amount); 
         PrintBalance(current_account);
         displayMovements(current_account);
        }
    }
  });
});
//Filters
const TransactionType = function (account_recieved){
  const deposit = account_recieved.movements.filter(function(num){
    return num>0;
  });
  const withdraw = account_recieved.movements.filter(function(num){
    return num<0;
  });
  const TotalDeposit = deposit.reduce(function(ac,ar){
    return ac+ar;
  });
  const TotalWithdraw = withdraw.reduce(function(ac,ar){
    return ac+ar;
  });
  const intrest = TotalDeposit * (1.2/100); 
  document.querySelector(".summary__value--in").innerHTML = `${TotalDeposit}€`;
  document.querySelector(".summary__value--out").innerHTML = `${Math.abs(TotalWithdraw)}€`;
  document.querySelector(".summary__value--interest").innerHTML = `${intrest}€`;
  console.log(intrest);
}
const day_temp = new Date();
const day_of_month = day_temp.getDate();
var month = day_temp.getMonth();
month += 1;
const year = day_temp.getFullYear();

document.querySelector(".date").innerHTML = new Date();

// var a = 0;
// btnSort.addEventListener('click', function(e){
//   e.preventDefault();
//   if (a == 0) {
//     const sorted_array = new Array([current_account.movements]);
//     a = 1;
//     console.log(sorted_array)
//     sorted_array.sort(function(a,b){return a-b;})
//     console.log(sorted_array)
//     // displayMovements(sorted_array);
//     // console.log(xd);
//   }
//   else{

//   }
// })



//balance 
const PrintBalance = function (account_recieved){
  const balance = account_recieved.movements.reduce(function(ac, ar){        //reduce callback parameters(Accumulator, current element, current index, whole array)
    return ac+ar;
  });
  document.querySelector(".balance__value").innerHTML = `${balance}€`;
}


//loan
btnLoan.addEventListener('click', function(e){
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  if (loanAmount > 0 && current_account.movements.some(function(mov){return mov>= loanAmount * 0.1;})) {
    current_account.movements.push(loanAmount);
    PrintBalance(current_account);
    displayMovements(current_account);
  }
})



//CloseAccount
btnClose.addEventListener('click', function(e){
  e.preventDefault();
  if (current_account.phone === inputClosephone.value && current_account.pin == inputClosePin.value) {
    const index = accounts.findIndex(function(acc){
      return (acc.phone == current_account.phone);
    });
    accounts.splice(index,1);
  }
});
//Movements display
const displayMovements = function (account_recieved) {
  containerMovements.innerHTML="";
  account_recieved.movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date"></div>
    <div class="movements__value">${mov}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
    account_recieved.movements_date.forEach(function(mov, i){
      document.querySelector(".movements__date").innerHTML = day_of_month +"-"+month+"-"+year;
    })
  });
}; 


//Logout timer
const logout_timer = function(){
  let time = 120;
  const timer = setInterval(function(){
     let minute = String(Math.trunc(time/60)).padStart(2,0);
     let seconds = String(time%60).padStart(2,0);
     labelTimer.innerHTML = `${minute}:${seconds}`;
     if (time === 0) {
       clearInterval(timer);
       containerApp.style.opacity = 0; 
      }
      time--;
  },1000)
}

//Execution
// displayMovements(current_account);
// TransactionType(current_account);
// PrintBalance(current_account);




/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],                //map formats are [key,value].
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);
/*    const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
    for (const [i,movement] of movements.entries()) {                    //.entries() returns => [index,elements]
      if (movement>0) {
        console.log(`Transaction ${i+1}: You deposited ${movement}`);
      }
      else console.log(`Transaction ${i+1}: You withdrew ${Math.abs(movement)}`);
    }   */

// currencies.forEach(function(value,key,map){
//   console.log(`${key}: ${value}`);
// });
/////////////////////////////////////////////////
