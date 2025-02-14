function generateQuotation() {
    const companyName = document.getElementById('companyName').value;
    const date = document.getElementById('date').value;
    const contactPerson = document.getElementById('contactPerson').value;
    const quotationNumber = document.getElementById('quotationNumber').value;
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

    // Load the image
    const img = new Image();
    img.src = 'https://raw.githubusercontent.com/mkashifk1978/qgen/main/logo.png'; // Replace with your image URL

    // Add image to the PDF
    img.onload = function () {
        // Add the image to the header
        doc.addImage(img, 'PNG', 10, 10, 50, 20); // Adjust dimensions (x, y, width, height) as needed

        // Add Quotation Number
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`Quotation Number: ${quotationNumber}`, 70, 20); // Adjust position (x, y) as needed

        // Add Company Details
        doc.setFontSize(12);
        doc.text(`Company Name: ${companyName}`, 10, 40);
        doc.text(`Date: ${date}`, 10, 50);
        doc.text(`Contact Person: ${contactPerson}`, 10, 60);

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
            startY: 70, // Adjusted startY to accommodate the image and header
            head: headers,
            body: data,
            theme: 'grid',
        });

        // Save PDF
        doc.save(`quotation_${quotationNumber}.pdf`);
    };

    // Handle image loading errors
    img.onerror = function () {
        alert('Failed to load the image. Please check the image URL.');
    };
}
