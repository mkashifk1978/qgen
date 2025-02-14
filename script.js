// script.js
let itemCount = 1;

function addItem() {
    itemCount++;
    const itemsContainer = document.getElementById('itemsContainer');
    const newItem = document.createElement('div');
    newItem.className = 'item';
    newItem.innerHTML = `
        <h3>Item ${itemCount}</h3>
        <label for="itemDetail${itemCount}">Item Detail:</label>
        <input type="text" id="itemDetail${itemCount}" name="itemDetail${itemCount}" required>

        <label for="unitPrice${itemCount}">Unit Price:</label>
        <input type="number" id="unitPrice${itemCount}" name="unitPrice${itemCount}" required>

        <label for="quantity${itemCount}">Quantity:</label>
        <input type="number" id="quantity${itemCount}" name="quantity${itemCount}" required>
    `;
    itemsContainer.appendChild(newItem);
}

function generateQuotation() {
    const companyName = document.getElementById('companyName').value;
    const date = document.getElementById('date').value;
    const contactPerson = document.getElementById('contactPerson').value;
    const taxPercentage = parseFloat(document.getElementById('taxPercentage').value);

    const items = [];
    let totalAmount = 0;

    for (let i = 1; i <= itemCount; i++) {
        const itemDetail = document.getElementById(`itemDetail${i}`).value;
        const unitPrice = parseFloat(document.getElementById(`unitPrice${i}`).value);
        const quantity = parseInt(document.getElementById(`quantity${i}`).value);
        const finalRate = unitPrice * quantity;

        items.push({
            itemDetail,
            unitPrice,
            quantity,
            finalRate,
        });

        totalAmount += finalRate;
    }

    const taxAmount = (totalAmount * taxPercentage) / 100;
    const grandTotal = totalAmount - taxAmount;

    // Initialize jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add Kashif Enterprises Banner
    doc.setFontSize(24);
    doc.setTextColor(40, 40, 40);
    doc.text("Kashif Enterprises", 10, 20);

    // Add Company Details
    doc.setFontSize(12);
    doc.text(`Company Name: ${companyName}`, 10, 30);
    doc.text(`Date: ${date}`, 10, 40);
    doc.text(`Contact Person: ${contactPerson}`, 10, 50);

    // Add Table Header
    const headers = [["Item Detail", "Unit Price", "Quantity", "Final Rate"]];
    const data = items.map(item => [
        item.itemDetail,
        `$${item.unitPrice.toFixed(2)}`,
        item.quantity,
        `$${item.finalRate.toFixed(2)}`,
    ]);

    // Add Total, Tax, and Grand Total
    data.push(["Total", "", "", `$${totalAmount.toFixed(2)}`]);
    data.push(["Tax Deduction", "", "", `$${taxAmount.toFixed(2)}`]);
    data.push(["Grand Total", "", "", `$${grandTotal.toFixed(2)}`]);

    // Generate Table
    doc.autoTable({
        startY: 60,
        head: headers,
        body: data,
        theme: 'grid',
    });

    // Save PDF
    doc.save('quotation.pdf');
}

// Include jsPDF and autoTable plugin
function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    document.head.appendChild(script);
}

loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js', () => {
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js', () => {
        console.log('jsPDF and autoTable loaded successfully!');
    });
});
