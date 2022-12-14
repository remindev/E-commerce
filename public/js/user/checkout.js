const inputActions = async (type, data) => {

    const inputsIDS = [{
        fNameInput: 'firstNameInput'
    },
    {
        lNameInput: 'lastNameInput'
    },
    {
        stateInput: 'stateInput'
    },
    {
        streetNumberInput: 'streetNumber'
    },
    {
        houseNumberInput: 'houseNumber'
    },
    {
        townInput: 'townInput'
    },
    {
        countryInput: 'countryInput'
    },
    {
        codeInput: 'codeInput'
    },
    {
        phoneInput: 'phoneInput'
    },
    {
        emailInput: 'emailInput'
    }
    ];

    const inputFields = {};
    const inputFieldErrs = {};

    inputsIDS.forEach((e, i) => {
        inputFields[Object.keys(e)[0]] = document.getElementById(e[Object.keys(e)[0]]);
    });

    Object.keys(inputFields).forEach((e, i) => {
        inputFieldErrs[e + "Err"] = inputFields[e].parentElement.querySelector('span');
    });

    const {
        fNameInput,
        lNameInput,
        stateInput,
        streetNumberInput,
        houseNumberInput,
        townInput,
        countryInput,
        codeInput,
        phoneInput,
        emailInput
    } = inputFields;

    const {
        fNameInputErr,
        lNameInputErr,
        stateInputErr,
        streetNumberInputErr,
        houseNumberInputErr,
        townInputErr,
        countryInputErr,
        codeInputErr,
        phoneInputErr,
        emailInputErr
    } = inputFieldErrs;

    Object.keys(inputFieldErrs).forEach(e => {
        inputFieldErrs[e].innerText = '';
    })

    switch (type) {
        case 'disable': {
            Object.keys(inputFields).forEach(e => {
                inputFields[e].setAttribute('disabled', '');
            });
            return true;
        };
        case 'enable': {
            Object.keys(inputFields).forEach(e => {
                inputFields[e].removeAttribute('disabled');
            });
            return true;
        };
        case 'clear': {
            Object.keys(inputFields).forEach(e => {
                inputFields[e].value = '';
            })
            return true;
        }
        case 'set': {
            Object.keys(inputFields).forEach(e => {
                inputFields[e].value = data[e];
            });
            return true;
        }
        case 'validate': {

            let flag = true;

            if ((fNameInput.value?.trim()?.match(/^[a-zA-Z]+(([a-zA-Z ])?[a-zA-Z]*)*$/g)) == null) {
                flag = false;
                fNameInputErr.innerText = 'Enter a valid name';
            };
            if ((lNameInput.value?.trim()?.match(/^[a-zA-Z]+(([a-zA-Z ])?[a-zA-Z]*)*$/g)) == null) {
                flag = false;
                lNameInputErr.innerText = 'Enter a valid name';
            };
            if ((stateInput.value?.trim()?.match(/^[a-zA-Z]+(([a-zA-Z ])?[a-zA-Z]*)*$/g)) == null) {
                flag = false;
                stateInputErr.innerText = 'Enter a valid state';
            };
            if (streetNumberInput?.value?.trim().length == 0) {
                flag = false;
                streetNumberInputErr.innerText = 'Plz fill out address fields';
            };
            if (houseNumberInput?.value?.trim().length == 0) {
                flag = false;
                houseNumberInputErr.innerText = 'Plz fill out address fields';
            };
            if (townInput?.value?.trim().length == 0) {
                flag = false;
                townInputErr.innerText = 'Town is required';
            };
            if (countryInput?.value?.trim().length == 0) {
                flag = false;
                countryInputErr.innerText = 'Select you country';
            };
            if (isNaN(Number(codeInput.value))) {
                flag = false;
                codeInputErr.innerText = 'Enter a valid code';
            };
            if ((phoneInput.value + "").trim().match(/^\+?[1-9][0-9]{7,14}$/) == null) {
                flag = false;
                phoneInputErr.innerText = 'Enter a valid phone number';
            };
            if ((emailInput.value + "").trim().match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) == null) {
                flag = false;
                emailInputErr.innerText = 'Enter a valid email';
            };

            if (flag) {
                try {
                    const paymentMetord = window?.typeOfPayment;
                    const coupon = document.getElementById("checkout-discount-input");
                    if (paymentMetord == 'paypal') {
                        return {
                            type: 'address',
                            address: {
                                name: fNameInput?.value?.trim() + " " + lNameInput?.value?.trim(),
                                state: stateInput?.value?.trim() ? stateInput?.value?.trim() : null,
                                streetNumber: streetNumberInput?.value?.trim() ? streetNumberInput?.value?.trim() : null,
                                houseNumber: houseNumberInput?.value?.trim() ? houseNumberInput?.value?.trim() : null,
                                town: townInput?.value?.trim() ? townInput?.value?.trim() : null,
                                country: countryInput?.value?.trim() ? countryInput?.value?.trim() : null,
                                postalCode: codeInput?.value ? codeInput?.value : null,
                                phone: phoneInput?.value ? phoneInput.value : null,
                                email: emailInput?.value?.trim() ? emailInput?.value?.trim() : null,
                            },
                            coupon: coupon?.value?.trim() ? coupon?.value?.trim() : null,
                            method: window?.typeOfPayment
                        };
                    } else {
                        const resp = await finalSubmitToServer({
                            type: 'address',
                            address: {
                                name: fNameInput?.value?.trim() + " " + lNameInput?.value?.trim(),
                                state: stateInput?.value?.trim() ? stateInput?.value?.trim() : null,
                                streetNumber: streetNumberInput?.value?.trim() ? streetNumberInput?.value?.trim() : null,
                                houseNumber: houseNumberInput?.value?.trim() ? houseNumberInput?.value?.trim() : null,
                                town: townInput?.value?.trim() ? townInput?.value?.trim() : null,
                                country: countryInput?.value?.trim() ? countryInput?.value?.trim() : null,
                                postalCode: codeInput?.value ? codeInput?.value : null,
                                phone: phoneInput?.value ? phoneInput.value : null,
                                email: emailInput?.value?.trim() ? emailInput?.value?.trim() : null,
                            },
                            coupon: coupon?.value?.trim() ? coupon?.value?.trim() : null,
                            method: window?.typeOfPayment
                        });
                    };
                } catch (error) {
                    Swal.fire({
                        title: 'Error Connecting to server',
                    });
                };
            } else {
                Swal.fire({
                    title: 'Plz fillout address',
                })
            };

        };
    };
};

const setAddress = async (addressID) => {
    try {

        // clears all input field if there is no address id
        if (!addressID) { inputActions('clear'); return 0; }

        // getting address data form server
        const dataFromServer = await fetch('/checkout/address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                addressID: addressID
            })
        });

        // parsign data form response
        const res = await dataFromServer.json();

        if (res.status == 'error') {
            console.log('Error => ', error);
        } else {
            const outputData = {
                fNameInput: res.message?.name?.split(' ')[0],
                lNameInput: res.message?.name?.split(' ')?.slice(1).join(' '),
                stateInput: res.message?.state,
                streetNumberInput: res.message?.streetNumber,
                houseNumberInput: res.message?.houseNumber,
                townInput: res.message?.town,
                countryInput: res.message?.countryCode,
                codeInput: res.message?.postalCode,
                phoneInput: res.message?.phone,
                emailInput: res.message?.email
            };
            inputActions('set', outputData);
        };

        notify('Address autofilled', 'success');

    } catch (error) {
        notify('Error connecting to server');
    };
};

const checkAddress = () => {
    const addresses = document.querySelectorAll('input[type=radio][name=address]');
    let output = '';
    addresses.forEach(e => {
        if (e.checked) {
            output = e.value;
        };
    });
    return (output);
};

const checkPayment = () => {
    const method = document.querySelectorAll('input[type=radio][name=typeOfOrder]');
    let output = '';
    method.forEach(e => {
        if (e.checked) {
            output = e.value;
        };
    });
    return (output);
}

const finalSubmit = (type) => {
    // if (checkAddress() != -1) {
    //     finalSubmitToServer({
    //         type: 'id',
    //         address: checkAddress(),
    //         method: checkPayment()
    //     });
    // } else {
    //     inputActions('validate');
    // };
    window.typeOfPayment = type;
    inputActions('validate');
};

const paySubmit = (data) => {
    window.checkOutData.keys = data;
    window.checkOutData.typeOfRequest = "verify";

    Swal.fire({
        title: 'Processing payment',
        html: 'Connecting to server ...',
        didOpen: () => {
            Swal.showLoading();

            fetch('/checkout/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(window.checkOutData)
            })
                .then(res => res.json())
                .then(res => {
                    if (res.status == 'error') {
                        Swal.fire({
                            title: res.message,
                            icon: 'error',
                        });
                    } else {
                        Swal.fire({
                            title: "Payment success !",
                            html: 'Order success',
                            icon: 'success',
                        }).then(result => {
                            if (res?.action) {
                                window.location.href = res.action;
                            } else {
                                window.location.href = '/dashboard/orders';
                            };
                        });
                    };
                })
                .catch(error => {
                    console.log("error =>", error);
                    Swal.fire({
                        title: "Error connecting to db",
                        icon: 'error',
                    });
                });
        }
    });
};

const finalSubmitToServer = async (data) => {

    Swal.fire({
        title: 'Processing Your order',
        html: 'Connecting to server ...',
        didOpen: async () => {
            Swal.showLoading();

            try {
                const dataFromServerFirsr = await fetch('/checkout', {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify(data)
                });

                const res = await dataFromServerFirsr.json();

                if (res.status == 'error') {
                    Swal.close();
                    notify(res.message);
                } else {

                    window.checkOutData = data;

                    if (data.method == 'razorpay') {

                        const options = {
                            "key": "rzp_test_oRZSfNK6JdPa46",
                            "name": res?.message?.user?.name ? res.message.user.name : res?.message?.user?.emali ? res?.message?.user?.emali : res?.message?.user?.phone,
                            "description": "Pay online",
                            "order_id": res.message.id,
                            "handler": function (response) {

                                paySubmit({
                                    orderID: res.message.orderID,
                                    id: response.razorpay_order_id,
                                    paymentID: response.razorpay_payment_id,
                                    signature: response.razorpay_signature
                                });

                            },
                            "prefill": {
                                "name": res?.message?.user?.name,
                                "email": res?.message?.user?.email,
                                "contact": "+91" + res?.message?.user?.phone
                            },
                            "notes": {
                                "mail": res?.message?.user?.email
                            },
                            "theme": {
                                "color": "#3399cc"
                            },
                            "modal": {
                                "ondismiss": function () {
                                    orderCancelled(res.message.orderID);
                                }
                            }
                        };

                        const rzp1 = new Razorpay(options);

                        rzp1.on('payment.failed', function (response) {
                            Swal.close();
                            notify('Error opening Razorpay"');
                            orderCancelled(res.message.orderID);
                        });

                        Swal.close();
                        rzp1.open();

                        console.log(res);
                    } else {
                        Swal.close();
                        Swal.fire({
                            title: 'Order succes !',
                            icon: 'success',
                            confirmButtonText: 'Go to orders',
                        }).then(result => {
                            window.location.href = res?.action ? res.action : '/dashboard/orders';
                        });
                    };
                };

            } catch (err) {
                console.log("Error =>", err);
                Swal.close();
                notify('Oops something went wrong !');
            };

        },
        willClose: (e) => {
            // console.log(e)
            // Swal doc after close
        }
    }).then((result) => {
        // console.log('result',result);
        // closed response of Swal progress popup
    });
};

const orderCancelled = async (orderID) => {
    try {

        const dataFromServer = await fetch(`/orders/failed/${orderID}`, {
            method: 'DELETE'
        });

        const res = await dataFromServer.json();

        if (res.status == 'error') throw error;

        notify('Payment cancelled');

    } catch (error) {
        notify(error);
    };
};