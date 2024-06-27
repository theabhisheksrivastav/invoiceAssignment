function numWords(n) {
    if (n < 0)
        return false;

    let single_digit = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    let double_digit = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    let below_hundred = ['Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (n === 0) return 'Zero';

    function translate(n) {
        let word = "";
        if (n < 10) {
            word = single_digit[n] + ' ';
        } else if (n < 20) {
            word = double_digit[n - 10] + ' ';
        } else if (n < 100) {
            let rem = translate(n % 10);
            word = below_hundred[Math.floor(n / 10) - 2] + ' ' + rem;
        } else if (n < 1000) {
            word = single_digit[Math.floor(n / 100)] + ' Hundred ' + translate(n % 100);
        } else if (n < 1000000) {
            word = translate(Math.floor(n / 1000)).trim() + ' Thousand ' + translate(n % 1000);
        } else if (n < 1000000000) {
            word = translate(Math.floor(n / 1000000)).trim() + ' Million ' + translate(n % 1000000);
        } else {
            word = translate(Math.floor(n / 1000000000)).trim() + ' Billion ' + translate(n % 1000000000);
        }
        return word;
    }

    let result = translate(n);
    return result.trim() + '.';
}

document.getElementById("submit-btn").addEventListener("click", function(e) {
    e.preventDefault();

    const formData = new FormData(document.getElementById("invoice-form"));
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    const productPrice = parseFloat(data["product-price"]);
    const productQuantity = parseInt(data["product-quantity"]);
    let discount = 0;
    if (data['product-discount'] === "something10") {
        discount = 0.10;
    }
    const netAmount = productPrice * productQuantity - (productPrice * productQuantity * discount);
    const taxRate = (data["placeofsupply"] === data["placeofdelivery"]) ? 0.18 : 0.18; // Adjust tax rate as per your logic
    const taxAmount = netAmount * taxRate;
    const totalAmount = netAmount + taxAmount;
    const totalAmountInWords = numWords(totalAmount);

    const signatureFile = document.getElementById("signature").files[0];
    let signatureDataURL = "";

    if (signatureFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            signatureDataURL = event.target.result;
            generateInvoiceHTML();
        };
        reader.readAsDataURL(signatureFile);
    } else {
        generateInvoiceHTML();
    }

    function generateInvoiceHTML() {
        const invoiceHTML = `
            <div class="receipt-content">
                <div class="container bootstrap snippets bootdey">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="invoice-wrapper">
                                <div class="intro">
                                    Hi <strong>${data["billing-name"]}</strong>, 
                                    <br>
                                    This is the receipt for a payment of <strong>${totalAmount.toFixed(2)}</strong> (INR) for your order
                                </div>
        
                                <div class="payment-info">
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <span>Order No.</span>
                                            <strong>${data["order-id"]}</strong>
                                        </div>
                                        <div class="col-sm-6 text-right">
                                            <span>Order Date</span>
                                            <strong>${data["order-date"]}</strong>
                                        </div>
                                    </div>
                                </div>
        
                                <div class="payment-details">
                                    <div class="row">
                                        <div class="col-sm-6">
                                            <span>Seller</span>
                                            <strong>
                                                ${data["seller-name"]}
                                            </strong>
                                            <p>
                                                ${data["seller-address-street"]}<br>
                                                ${data["seller-address-city"]}<br>
                                                ${data["seller-address-pincode"]} <br>
                                                ${data["seller-address-state"]} <br>
                                                GST No. : ${data["seller-gst"]}
                                                PAN No. : ${data["seller-pan"]}
                                            </p>
                                        </div>
                                        <div class="col-sm-6 text-right">
                                            <span>Shipping To</span>
                                            <strong>
                                                ${data["billing-name"]}
                                            </strong>
                                            <p>
                                                ${data["billing-address-street"]} <br>
                                                ${data["billing-address-city"]} <br>
                                                ${data["billing-address-pincode"]} <br>
                                                ${data["billing-address-state"]} <br>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Sl. No</th>
                                            <th>Description</th>
                                            <th>Unit Price</th>
                                            <th>Qty</th>
                                            <th>Net Amount</th>
                                            <th>Tax Rate</th>
                                            <th>Tax Amount</th>
                                            <th>Total Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>${data["product-name"]}</td>
                                            <td>${productPrice}</td>
                                            <td>${productQuantity}</td>
                                            <td>${netAmount}</td>
                                            <td>${(taxRate * 100).toFixed(2)}%</td>
                                            <td>${taxAmount.toFixed(2)}</td>
                                            <td>${totalAmount.toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div id="footer">
                                    <p>For ${data["seller-name"]}</p>
                                    <img src="${signatureDataURL}" alt="Signature" width="100">
                                    <p>Authorized Signatory</p>
                                    <p>Whether tax is payable under reverse charge - ${data["return-charge"]}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>
table {
        border-collapse: collapse;
        max-width: 439px;
    }

    th, td {
        border: 1px solid black;
        text-align: left;
        padding: 8px;
        max-width: 439px;

    }

    th {
        background-color: hsl(0, 0%, 80%);
        max-width: 439px;

        
    }

	.receipt-content .logo a:hover {
  text-decoration: none;
  color: #7793C4; 
}

.receipt-content .invoice-wrapper {
  background: #FFF;
  border: 1px solid #CDD3E2;
  box-shadow: 0px 0px 1px #CCC;
  padding: 40px 40px 60px;
  margin-top: 40px;
  border-radius: 4px; 
}

.receipt-content .invoice-wrapper .payment-details span {
  color: #A9B0BB;
  display: block; 
}
.receipt-content .invoice-wrapper .payment-details a {
  display: inline-block;
  margin-top: 5px; 
}

.receipt-content .invoice-wrapper .line-items .print a {
  display: inline-block;
  border: 1px solid #9CB5D6;
  padding: 13px 13px;
  border-radius: 5px;
  color: #708DC0;
  font-size: 13px;
  -webkit-transition: all 0.2s linear;
  -moz-transition: all 0.2s linear;
  -ms-transition: all 0.2s linear;
  -o-transition: all 0.2s linear;
  transition: all 0.2s linear; 
}

.receipt-content .invoice-wrapper .line-items .print a:hover {
  text-decoration: none;
  border-color: #333;
  color: #333; 
}

.receipt-content {
  background: #ECEEF4; 
}
@media (min-width: 1200px) {
  .receipt-content .container {width: 900px; } 
}

.receipt-content .logo {
  text-align: center;
  margin-top: 50px; 
}

.receipt-content .logo a {
  font-family: Myriad Pro, Lato, Helvetica Neue, Arial;
  font-size: 36px;
  letter-spacing: .1px;
  color: #555;
  font-weight: 300;
  -webkit-transition: all 0.2s linear;
  -moz-transition: all 0.2s linear;
  -ms-transition: all 0.2s linear;
  -o-transition: all 0.2s linear;
  transition: all 0.2s linear; 
}

.receipt-content .invoice-wrapper .intro {
  line-height: 25px;
  color: #444; 
}

.receipt-content .invoice-wrapper .payment-info {
  margin-top: 25px;
  padding-top: 15px; 
}

.receipt-content .invoice-wrapper .payment-info span {
  color: #A9B0BB; 
}

.receipt-content .invoice-wrapper .payment-info strong {
  display: block;
  color: #444;
  margin-top: 3px; 
}

@media (max-width: 767px) {
  .receipt-content .invoice-wrapper .payment-info .text-right {
  text-align: left;
  margin-top: 20px; } 
}
.receipt-content .invoice-wrapper .payment-details {
  border-top: 2px solid #EBECEE;
  margin-top: 30px;
  padding-top: 20px;
  line-height: 22px; 
}


@media (max-width: 767px) {
  .receipt-content .invoice-wrapper .payment-details .text-right {
  text-align: left;
  margin-top: 20px; } 
}
.receipt-content .invoice-wrapper .line-items {
  margin-top: 40px; 
}
.receipt-content .invoice-wrapper .line-items .headers {
  color: #A9B0BB;
  font-size: 13px;
  letter-spacing: .3px;
  border-bottom: 2px solid #EBECEE;
  padding-bottom: 4px; 
}
.receipt-content .invoice-wrapper .line-items .items {
  margin-top: 8px;
  border-bottom: 2px solid #EBECEE;
  padding-bottom: 8px; 
}
.receipt-content .invoice-wrapper .line-items .items .item {
  padding: 10px 0;
  color: #696969;
  font-size: 15px; 
}
@media (max-width: 767px) {
  .receipt-content .invoice-wrapper .line-items .items .item {
  font-size: 13px; } 
}
.receipt-content .invoice-wrapper .line-items .items .item .amount {
  letter-spacing: 0.1px;
  color: #84868A;
  font-size: 16px;
 }
@media (max-width: 767px) {
  .receipt-content .invoice-wrapper .line-items .items .item .amount {
  font-size: 13px; } 
}

.receipt-content .invoice-wrapper .line-items .total {
  margin-top: 30px; 
}

.receipt-content .invoice-wrapper .line-items .total .extra-notes {
  float: left;
  width: 40%;
  text-align: left;
  font-size: 13px;
  color: #7A7A7A;
  line-height: 20px; 
}

@media (max-width: 767px) {
  .receipt-content .invoice-wrapper .line-items .total .extra-notes {
  width: 100%;
  margin-bottom: 30px;
  float: none; } 
}

.receipt-content .invoice-wrapper .line-items .total .extra-notes strong {
  display: block;
  margin-bottom: 5px;
  color: #454545; 
}

.receipt-content .invoice-wrapper .line-items .total .field {
  margin-bottom: 7px;
  font-size: 14px;
  color: #555; 
}

.receipt-content .invoice-wrapper .line-items .total .field.grand-total {
  margin-top: 10px;
  font-size: 16px;
  font-weight: 500; 
}

.receipt-content .invoice-wrapper .line-items .total .field.grand-total span {
  color: #20A720;
  font-size: 16px; 
}

.receipt-content .invoice-wrapper .line-items .total .field span {
  display: inline-block;
  margin-left: 20px;
  min-width: 85px;
  color: #84868A;
  font-size: 15px; 
}

.receipt-content .invoice-wrapper .line-items .print {
  margin-top: 50px;
  text-align: center; 
}



.receipt-content .invoice-wrapper .line-items .print a i {
  margin-right: 3px;
  font-size: 14px; 
}

.receipt-content .footer {
  margin-top: 40px;
  margin-bottom: 110px;
  text-align: center;
  font-size: 12px;
  color: #969CAD; 
}                
</style>
        `;

        document.getElementById("invoice-preview").innerHTML = invoiceHTML;
        document.getElementById("invoice-preview").style.display = "block";
        document.getElementById("save-pdf-btn").style.display = "block";
        document.getElementById("save-button").style.display = "block";
    }
});

document.getElementById("save-pdf-btn").addEventListener("click", function() {
    const invoicePreview = document.getElementById("invoice-preview");
    html2canvas(invoicePreview).then(canvas => {
        const imgData = canvas.toDataURL("image/png");
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();

        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("invoice.pdf");
    });
});


// document.getElementById("save-pdf-btn").addEventListener("click", function() {
// const invoicePreview = document.getElementById("invoice-preview");
// html2canvas(invoicePreview).then(canvas => {
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF();
//     pdf.addImage(imgData, "PNG", 0, 0);
//     pdf.save("invoice.pdf");
// });
// });