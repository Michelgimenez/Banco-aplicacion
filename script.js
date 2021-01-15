'use strict';

// Las cuentas con el nombre, los movimientos, los intereses de esos movimientos, el pin, las fechas de los movimientos, la moneda del pais, y la localidad
const account1 = {
  owner: 'Nicolas Krain',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-03T21:31:17.178Z',
    '2020-11-04T07:42:02.383Z',
    '2020-11-05T09:15:04.904Z',
    '2020-11-06T10:17:24.185Z',
    '2020-11-07T14:11:59.604Z',
    '2020-11-08T17:01:17.194Z',
    '2020-11-09T23:36:17.929Z',
    '2020-11-10T18:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Amanda Luna',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Michel Gimenez',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 3333,

  movementsDates: [
    '2019-11-03T21:31:17.178Z',
    '2020-11-04T07:42:02.383Z',
    '2020-11-05T09:15:04.904Z',
    '2020-11-06T10:17:24.185Z',
    '2020-11-07T14:11:59.604Z',
    '2020-11-08T17:01:17.194Z',
    '2020-11-09T23:36:17.929Z',
    '2020-11-10T18:51:36.790Z',
  ],
  currency: 'ARS',
  locale: 'es-AR',
};

// Almaceno en esta variable un array con las cuentas.
const accounts = [account1, account2, account3];

// Elementos del DOM
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

// Funciones
// Este metodo recibe la fecha que voy a darle formato legible y la localidad que puede ser por ejemplo es-AR. Despues procedo dentro a llamar a la funcion de calcDaysPassed que le paso la fecha actual y la fecha del movimiento, esto me da como retorno los dias en numero que pasaron entre la fecha actual y la fecha del movimiento, este resultado lo almaceno en la variable de daysPassed. Despues procedo a verificar que si los dias pasados fueron 0, entonces doy como retorno la string de HOY, si paso 1 dia, coloco ayer, si pasaron 7 dias o menos, coloco la cantidad de dias pasados, y si pasaron mas de 7 dias simplemente voy a colocar la fecha en formato legible usando el operador internacional de fechas que le paso la localidad, las opciones y la fecha a darle formato.
const formatMovementsDate = (date, locale) => {
  const calcDaysPassed = (date1, date2) => {
    return Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24))); // El resultado lo recibo en milisegundos si solo dejo la resta, para poder pasarlo a un numero entero, realizo el truco de dividir el resultado por la multiplicacion de 1000 para pasar milisegundos a segundo, por 60 para pasarlo a minutos, otros 60 para pasarlo a horas y 24 para pasarlo a dias. Aplico abs para quitar signos negativos y round para quitar decimales.
  };

  const daysPassed = calcDaysPassed(new Date(), date);

  // Si los dias pasados son iguales a 0, retorno la string de hoy, si es uno, la de ayer, si el numero es igual o menor a la cantidad de dias de la semana, despliego la cantidad de dias pasados. Y si no se cumple anda de eso, es decir, pasaron mas de 7 dias, retorno la string que muestra el dia mes y ano
  if (daysPassed === 0) {
    return 'Hoy';
  } else if (daysPassed === 1) {
    return 'Ayer';
  } else if (daysPassed <= 7) {
    return `hace ${daysPassed} dias`;
  } else {
    const options = {
      hour: '2-digit',
      minute: 'numeric',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };

    return new Intl.DateTimeFormat(locale, options).format(date);
  }
};

// Creo una funcion para darle formato a los numeros de los movimientos. Recibe el numero a darle formato, el valor local de la cuenta (es-AR, etc), y las opciones para colocar que currency va a ser (USD, EUR, etc)
const formatCurrencies = (value, locale, options) => {
  return new Intl.NumberFormat(locale, options).format(value);
};

// Este metodo recibe la cuenta que inicio sesion. Lo primero que hace es vaciar los movimientos en el html tras iniciar sesion en otra cuenta Despues almaceno en una variable llamada MOVS los movimientos ordenados de menor a mayor en caso de SORT sea TRUE, caso contrario, los movimientos como estan intactos. Despues por cada movimiento en el array de MOVS, procedo a verificar que si el numero es mayor a 0, entonces le doy el tipo de DEPOSITO, caso contrario de RETIRO. Uno es para la class que le cambia el color al html, el otro es para colocar el texto en el html. Despues para la fecha del retiro/deposito, creo una fecha con el operador de DATE y le paso dentro el array de fechas de movimientos del usuario y selecciono de forma dinamica la fecha utilizando el INDEX que recibo en cada loopeo del forEach, esto convierte la fecha que esta almacenada, en un formato legible y procedo a llamar al metodo de formatMovementsDate que usa ese formato mas legible para recibir el dia, hora, mes, etc y almaceno el resultado en displayDate teniendo por ejemplo 15/01/2021. Despues por otro lado creo una variable de opciones donde coloco el tipo de moneda que la recibo de la informacion de la cuenta y procedo a llamar al metodo internacional de numeros donde le paso le paso la localidad, por ejemplo es-AR y le paso las opciones de la moneda, por ejemplo ARS y finalmente el movimiento al que quiero darle el formato. Y finalmente creo el html del movimiento en cada loopeo, colocando la fecha del movimiento, el nuevo formateado correctamente segun la moneda y localidad y finalmente lo inyecto en el div de los movimientos. De esa forma se inyecta cada movimiento, uno debajo de otro.
const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const typeHtml = mov > 0 ? 'deposito' : 'retiro';

    const date = new Date(account.movementsDates[i]);

    const displayDate = formatMovementsDate(date, account.locale);

    const optionss = {
      style: 'currency',
      currency: account.currency,
    };

    const formattedMovement = new Intl.NumberFormat(
      account.locale,
      optionss
    ).format(mov);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${typeHtml}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMovement}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Este metodo muestra el balance total de la cuenta. Recibiendo la cuenta que inicio sesion. Despues procede a almacenar en la cuenta, un field llamado BALANCE donde lo que hago es utilizar el metodo REDUCE para comenzar en 0, cada por cada movimiento encontrado se va sumando al reducer que es ACC, terminando con el numero total de movimientos ya sea en negativo o positivo. Despues procedo a crear la opcion del tipo de moneda que recibo de la cuenta. Y procedo a usar la api internacional de numeros para formatear el numero total del balance y pongo ese numero en el div del balance.
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  const optionsss = {
    style: 'currency',
    currency: acc.currency,
  };

  const formattedbalance = new Intl.NumberFormat(acc.locale, optionsss).format(
    acc.balance
  );
  labelBalance.textContent = `${formattedbalance}`;
};

// Este metodo despliega el total de ingresos, gastos e intereses de la cuenta. Para los ingresos uso filter para filtrar del array de movimientos, los que sean mayor a 0, y a este nuevo array le aplico reduce para sumarlos todos. Y para desplegar la moneda en formato correcto en el div de ingresos, le paso el resultado de llamar a la funcion de formatCurrencies que le paso el numero del ingreso total, la localidad y le paso el objeto de las opciones que especifica el tipo de moneda. Para los gastos Repito el mismo proceso en este caso filtrando los movimientos menores a 0, sumandolos a todos y nuevamente llamando a la funcion que les da formato. En el caso de los interes filtro los movimientos positivos, y para obtener el interes de forma dinamica, por ejemplo 1,2%, me fijo el field de interestRate de la cuenta, que es el interes del banco, simplemente por cada movimiento que encuentro, lo multiplico por interestRate(1.2%), por ejemplo 100, da 120, y esto lo divido por 100, da 1.2 que es su 1,2% de interes, y finalmente sumo todos los valores que serian por ejemplo (1.2, 4.5, 1.5, 35.6, 90.5, 190.5) y los coloco en el div repitiendo el proceso de llamar a la funcion que le da formato. Repito el filter en ese encadenamiento ya que el banco solo cobra intereses si el interes cobrado es mayor a 1, entonces filtro los interes que no sean mayores a 1, y me quedo con los que lo son.
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = formatCurrencies(incomes, acc.locale, {
    style: 'currency',
    currency: acc.currency,
  });

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = formatCurrencies(Math.abs(out), acc.locale, {
    style: 'currency',
    currency: acc.currency,
  });

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = formatCurrencies(interest, acc.locale, {
    style: 'currency',
    currency: acc.currency,
  });
};

// Este metodo que recibe las cuentas de los usuarios, procedo a loopear sobre cada cuenta, y por cada una encontrada procedo a crearle el field de USERNAME donde su valor va a ser igual a seleccionar el field de owner de la cuenta que contiene el nombre del usuario, a esto lo vuelvo minusculas, despues usoSPLIT para crear un array con el nombre y apellido separados, despues procedo a mapear sobre este array y seleciono de cada string su primer valor, esto me devuelve por ejemplo pasando de ['michel', 'gimenez'] a  ['m', 'g'] y uso JOIN para unirlo en una sola string. Quedando entonces el field de USERNAME teniendo como valor 'mg'
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

// Apenas inicia la aplicacion llamo a este metodo enviandole el array de cuentas.
createUsernames(accounts);

// Este metodo recibe toda la informacion de la cuenta que inicio sesion para actualizar la UI con toda la informacion de esta, siendo los movimientos, ingresos, etc. Llamo primero al metodo que despliega todos los movimientos de la cuenta, despues el metodo que despliega el balance de la cuenta mostrando el total de dinero total disponible en la cuenta, y despues el metodo que me muestra los ingresos totales, gastos totales y los intereses. Y por ultimo voy a proceder a llamar al metodo de startLogOutTimer() que comienza el conteo de 5 minutos para cerrar la sesion, pero antes de hacerlo, verifico que no haya ya un timer corriendo, que en ese caso cancelo el timer y lo vuelvo a iniciar.
const updateUI = function (acc) {
  displayMovements(acc);

  calcDisplayBalance(acc);

  calcDisplaySummary(acc);

  // Al iniciar sesion o realizar algun movimiento en la cuenta se va a ejecutar esta funcion (startLogOutTimer) con el conteo reiniciado en 05:00, esto lo almaceno en la variable de TIMER. Osea timer va a contener el intervalo. Pero para poder aplicar la funcionalidad de reiniciar el timer y evitar por ejemplo el bug de que al iniciar una segunda sesion con la anterior teniendo el timer corriendo, se mezclan dos timers al mismo tiempo, de esa forma aplico el if para verificar que si hay contenido dentro de TIMER, es decir ya hay un intervalo ejecutado, entonces procedo a darlo por finalizado antes de ejecutar el nuevo, citando el metodo que finaliza los intervalos y pasandole la variable que contiene el intervalo ejecutado
  if (timer) {
    clearInterval(timer);
  }
  timer = startLogOutTimer();
};

// Este es el metodo que inicia el timer de 5 minutos para cerrar sesion. Lo primero es establecer el tiempo que en este caso 300 segundos son 5 minutos. Despues llamo inmediatamente a la funcion que cree de tikTokJe que es la que coloca el timer en el html, lo hago para que al iniciar sesion, se reemplaze automaticamente el html default que tengo en el index.html, y tras reemplazarse ese html, procedo a usar un timer para que en un 1 segundo se vuelva a llamar al timer de 5 minutos y asi comenzar finalmente el timer que se almacena en la variable de logOutTimer y que doy como retorno para utilizarlo por ejemplo en UPDATEUI que almacena el timer en la variable de TIMER. Pero ahora procedo a explicar el metodo del timer que se llama tikTokJe donde dentro lo primero que hago es crear la variable de MIN donde divido la variable time(300) por 60, esto me da un decimal que quito y dejo en un entero con MATH.TRUNC(), al quedarme un numero entero en este caso 5, uso padStart para agregarle un 0 al principio y el 2 es para avisar que este numero va a tener maximo 2 digitos. El metodo de pad es solo para strings asi que primero paso el resultado de MATH.TRUNC (5) a string. Termino con 05 entonces en string. Despues para los segundos procedo a usar en este caso reminder que es con %, eso me da el sobrante de las divisiones, en el caso de 300 % 60 el sobrante es 0, este resultado lo paso a string y le aplico padStart para agregarle un 0 al principio y volver a limitar los digitos a solo 2. Quedando entonces en 00. Y finalmente coloco en el div del timer, como contenido, los minutos y segundos que cree. Si la variable de TIME llega a 0 tras restarle varias veces, entonces procedo a finalizar el intervalo que almacene al principio en logOutTimer y procedo a ocultar el div de la app y colocar denuevo el texto de iniciar sesion. Y finalmente mientras time sea mayor a 0, cada vez que el intervalo llama a tikTokJe cada 1 segundo, el valor de time se va restando 1, y se va actualizando el timer con cada vez numeros mas bajos hasta llegar a 0.
const startLogOutTimer = () => {
  let time = 300;

  const tikTokJe = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);

    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(logOutTimer);

      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Por favor inicie sesion';
    }

    time = time - 1;
  };

  tikTokJe();

  const logOutTimer = setInterval(tikTokJe, 1000);

  return logOutTimer;
};

// Aca tengo la variable que va a contener la cuenta que se inicio sesion y la variable que va a contener el timer.
let currentAccount, timer;

// Para emular que tengo sesion iniciada asi no tengo que loguear cada vez que se recarga la pagina
/*
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 1;
*/

// Cuando el usuario da click al boton de logIn
btnLogin.addEventListener('click', function (e) {
  // 1) Evito el comportamiento default de los formularios que recargan la pagina
  e.preventDefault();

  // 2) En la variable de currentAcount voy a colocar el resultado de buscar en el array de accounts, la cuenta cuyo nombre sea igual al ingresado en el input de nombre en el login
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // 3) Una vez encontrado el usuario y almaceno en la variable, procedo a verificar que si el pin de esta cuenta encontrada es igual al pin ingresado en el input, entonces procedo a colocar en el div del texto de bienvenida, un texto personalizado seleccionando el primer nombre del usuario. Y y le doy opacidad de 100 al div de la app para que se muestre el contenido. Despues procedo a crear una variable de opciones para la api de fechas internacionales de javascript. Y dentro coloco las opciones que quiero para el horario y para el dia. Y finalmente coloco un intervalo que se va a ejecutar cada 1 segundo y lo que va a hacer es colocar en el div de la fecha como contenido, un llamado a la api de fechas internacionales y le paso la localidad de la cuenta que se encuentra en la variable de currentAccount y en el field de LOCALE que por ejemplo seria es-AR, y en opciones le coloco la variable que cree. Y a este resultado le aplico el metodo de format para que se le de formato a la fecha. De esta forma cada 1 segundo se actualiza la fecha. Finalmente vacio los inputs y le quito el enfoque a ambos inputs con BLUR(), y finalmente llamo al metodo de updateUI para desplegar en el HTML toda la informacion de los movimientos de la cuenta
  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    const options = {
      hour: '2-digit',
      minute: 'numeric',
      second: '2-digit',
      day: 'numeric',
      month: '2-digit',
      year: 'numeric',
    };

    setInterval(() => {
      labelDate.textContent = new Intl.DateTimeFormat(
        currentAccount.locale,
        options
      ).format();
    }, 1000);

    // Lo ideal es no crear la opcion del pais de forma manual, lo ideal es obtener el pais e idioma desde la informacion de la persona, esto me da por ejemplo en mi caso es-AR ya que tengo en espanol y soy de argentina
    const locale = navigator.language;
    console.log(locale);
    console.log(new Intl.DateTimeFormat(locale, options).format());

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    inputLoginUsername.blur();

    updateUI(currentAccount);
  }
});

// En caso de tocar el boton de transferir, procedo a obtener el valor a enviar del input, despues procedo a almacenar en la variable de RECEIVER, el resultado de buscar la cuenta cuyo nombre sea igual al nombre ingresado en el input. Despues procedo a vaciar los inputs. Y antes de enviar el dinero procedo a verificar que el valor ingresado sea mayor a 0, que la cuenta a enviar exista, despues que el balance de la cuenta sea mayor o igual al monto a enviar y despues que la cuenta a enviar no sea igual a la cuenta que tiene sesion iniciada. En ese caso procedo a agregar en los movimientos del usuario con sesion iniciada, un movimiento negativo de salida, y en la cuenta destino procedo a agregar el movimiento positivo. Despues procedo a agregar las fechas de los movimientos en el array de movimientos de la cuenta actual y la cuenta que recibe el dinero usando el operador de DATE y el metodo de toISOString pasa pasar la fecha a formato legible. Finalmente llamo al metodo que actualiza la UI con los nuevos movimientos en el usuario actual y el usuario que recibio la transferencia.
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
  }
});

// Si se toca el boton que solicita un prestamo. Procedo a recibir el valor pasandolo a un numero entero con FLOOR que si ingreso 23,9 lo paso a 23. Despues corroboro que si el numero es mayor a 0 entonces procedo a llamar un timer que tras 1 segundo y medio procede a anadir este movimiento positivo en la cuenta del usuario actual, procede a agregar la fecha del movimiento en el array de fechas y actualiza la UI con estos nuevos datos. La idea de el timer es para emular el delay de la solicitud del prestamo.
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0) {
    setTimeout(() => {
      currentAccount.movements.push(amount);

      currentAccount.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount);
    }, 1500);
  }
  inputLoanAmount.value = '';
});

// Si el usuario le da al boton de cerrar sesion, primero corroboro que el nombre ingresado en el input sea igual al nombre de la cuenta que tiene sesion iniciada y que tambien la clave ingresada sea igual a la de la sesion iniciada. En ese procedo a almacenar en INDEX, el resultado de buscar el index de la cuenta cuyo nombre sea igual al de la cuenta que tiene sesion iniciada. Esto me almacena el index que tiene esa cuenta en el array de 'accounts'. Entonces procedo a seleccionar el array y uso SPLICE para eliminar la cuenta del array pasandole el index desde donde comienzo a eliminar y le coloco 1 que es para eliminar solo ese elemento. Despues procedo a ocultar la UI. Cas contrario de que la informacion ingresada sea erronea procedo a vaciar los inputs.
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;

// Si se toca el boton de SORT procedo a enviar los movimientos al metodo que despliega los movimientos y le paso SORTED alreves, es decir valiendo TRUE para que se ordenen los movimientos de mayor a menor. Y procedo a darle de valor a SORTED, el valor contrario, pasando de FALSE a TRUE. Asi cuando haga click a SORT de nuevo para quitar el orden de mayor a menor, le paso en este caso SORTED al reves, siendo de TRUE a FALSE.
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
