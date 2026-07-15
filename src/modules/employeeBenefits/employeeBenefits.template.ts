export interface PayslipDTO {
  company: {
    name: string;
  };

  employee: {
    firstName: string;
    lastName: string;
    department: {
      name: string;
    } | null;
    jobTitle: string | null;
  };

  payroll: {
    month: number;
    year: number;
    generatedAt: Date;
    paidAt: Date | null;
  };

  earnings: {
    name: string;
    amount: number;
  }[];

  deductions: {
    name: string;
    amount: number;
  }[];

  totals: {
    grossPay: number;
    totalEarnings: number;
    totalDeductions: number;
    netPay: number;
  };
}


export function generatePayslip(dto: PayslipDTO): string {
  const currency = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);

  const payrollMonth = new Date(
    dto.payroll.year,
    dto.payroll.month - 1,
  ).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>

<style>

*{
    box-sizing:border-box;
}

body{
    font-family:Arial, Helvetica, sans-serif;
    padding:40px;
    color:#222;
}

.container{
    max-width:900px;
    margin:auto;
}

.header{
    text-align:center;
    margin-bottom:35px;
}

.company{
    font-size:28px;
    font-weight:bold;
}

.title{
    margin-top:10px;
    font-size:20px;
    letter-spacing:2px;
}

.section{
    margin-top:30px;
}

.section-title{
    font-size:16px;
    font-weight:bold;
    margin-bottom:12px;
    border-bottom:2px solid #eee;
    padding-bottom:6px;
}

.info-grid{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:12px;
}

.info-item{
    padding:8px 0;
}

.label{
    font-weight:bold;
}

table{
    width:100%;
    border-collapse:collapse;
    margin-top:10px;
}

th{
    background:#f4f4f4;
    text-align:left;
}

th,
td{
    padding:10px;
    border:1px solid #ddd;
}

.amount{
    text-align:right;
}

.summary{
    width:350px;
    margin-left:auto;
    margin-top:25px;
}

.summary td{
    font-weight:bold;
}

.net-pay{
    background:#f4f4f4;
    font-size:17px;
}

.footer{
    margin-top:70px;
    text-align:center;
    font-size:12px;
    color:#777;
}

</style>

</head>

<body>

<div class="container">

<div class="header">
    <div class="company">
        ${dto.company.name}
    </div>

    <div class="title">
        PAYSLIP
    </div>
</div>

<div class="section">

    <div class="section-title">
        Employee Information
    </div>

    <div class="info-grid">

        <div class="info-item">
            <span class="label">Employee:</span>
            ${dto.employee.firstName} ${dto.employee.lastName}
        </div>

       

        <div class="info-item">
            <span class="label">Department:</span>
            ${dto.employee.department?.name ?? "-"}
        </div>

        <div class="info-item">
            <span class="label">Job Title:</span>
            ${dto.employee.jobTitle ?? "-"}
        </div>

    </div>

</div>


<div class="section">

<div class="section-title">
Payroll Information
</div>

<div class="info-grid">

<div class="info-item">
<span class="label">Payroll Month:</span>
${payrollMonth}
</div>

<div class="info-item">
<span class="label">Paid At:</span>
${dto.payroll.paidAt
  ? dto.payroll.paidAt.toLocaleDateString()
  : "-"}
</div>

</div>

</div>


<div class="section">

<div class="section-title">
Earnings
</div>

<table>

<thead>

<tr>

<th>Description</th>

<th class="amount">
Amount
</th>

</tr>

</thead>

<tbody>

${dto.earnings
  .map(
    (earning :any) => `
<tr>

<td>${earning.name}</td>

<td class="amount">
${currency(earning.amount)}
</td>

</tr>
`,
  )
  .join("")}

</tbody>

</table>

</div>



<div class="section">

<div class="section-title">
Deductions
</div>

<table>

<thead>

<tr>

<th>Description</th>

<th class="amount">
Amount
</th>

</tr>

</thead>

<tbody>

${dto.deductions
  .map(
    (deduction :any) => `
<tr>

<td>${deduction.name}</td>

<td class="amount">
${currency(deduction.amount)}
</td>

</tr>
`,
  )
  .join("")}

</tbody>

</table>

</div>



<table class="summary">

<tr>

<td>Gross Pay</td>

<td class="amount">
${currency(dto.totals.grossPay)}
</td>

</tr>

<tr>

<td>Total Earnings</td>

<td class="amount">
${currency(dto.totals.totalEarnings)}
</td>

</tr>

<tr>

<td>Total Deductions</td>

<td class="amount">
${currency(dto.totals.totalDeductions)}
</td>

</tr>

<tr class="net-pay">

<td>Net Pay</td>

<td class="amount">
${currency(dto.totals.netPay)}
</td>

</tr>

</table>


<div class="footer">

This is a computer generated payslip.<br/>

No signature is required.

</div>

</div>

</body>

</html>
`;
}