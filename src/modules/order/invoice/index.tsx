import { forwardRef } from 'react';

// Define props type for Invoice if needed (optional)
interface InvoiceProps {}

// Using `forwardRef` to allow external access for printing
const Invoice = forwardRef<HTMLDivElement, InvoiceProps>((_, ref) => (
  <div ref={ref} className="invoice-container bg-white shadow-lg p-6">
    <div className="flex justify-between items-center border-b pb-4 mb-4">
      <div className="flex items-center space-x-4">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg"
          alt="Tailwind Inc. Logo"
          className="h-12 w-12"
        />
        <h1 className="text-xl font-bold text-gray-800">Tailwind Inc.</h1>
      </div>
      <div className="text-right text-sm text-gray-600">
        <p>sales@tailwindcss.com</p>
        <p>+41-442341232</p>
        <p>VAT: 8657671212</p>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b">
      <div>
        <h2 className="font-semibold text-gray-800 mb-2">Bill To:</h2>
        <p className="text-gray-700">Laravel LLC.</p>
        <p className="text-gray-600">102, San-Francisco, CA, USA</p>
        <p className="text-gray-600">info@laravel.com</p>
      </div>
      <div className="text-right">
        <div className="mb-2">
          <p className="text-xs text-gray-500">Invoice Number</p>
          <p className="font-semibold">INV-2023786123</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Invoice Date</p>
          <p>03/07/2023</p>
          <p className="text-xs text-gray-500 mt-1">Due Date</p>
          <p className="text-red-600">31/07/2023</p>
        </div>
      </div>
    </div>

    <table className="w-full mb-4 text-sm">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="p-2 text-left">Description</th>
          <th className="p-2 text-right">Quantity</th>
          <th className="p-2 text-right">Price</th>
          <th className="p-2 text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b">
          <td className="p-2">
            <p className="font-semibold text-gray-800">E-commerce Platform</p>
            <p className="text-xs text-gray-500">
              Laravel based e-commerce platform
            </p>
          </td>
          <td className="p-2 text-right">500.0</td>
          <td className="p-2 text-right">$100.00</td>
          <td className="p-2 text-right font-semibold">$5,000.00</td>
        </tr>
        <tr className="border-b">
          <td className="p-2">
            <p className="font-semibold text-gray-800">Frontend Design</p>
            <p className="text-xs text-gray-500">
              Frontend design using Vue.js and Tailwind CSS
            </p>
          </td>
          <td className="p-2 text-right">500.0</td>
          <td className="p-2 text-right">$100.00</td>
          <td className="p-2 text-right font-semibold">$5,000.00</td>
        </tr>
        <tr>
          <td className="p-2">
            <p className="font-semibold text-gray-800">Shop SEO</p>
            <p className="text-xs text-gray-500">
              Website SEO and Social Media marketing
            </p>
          </td>
          <td className="p-2 text-right">50.0</td>
          <td className="p-2 text-right">$100.00</td>
          <td className="p-2 text-right font-semibold">$500.00</td>
        </tr>
      </tbody>
    </table>

    <div className="border-t pt-4">
      <div className="flex justify-between mb-2">
        <p className="text-gray-600">Subtotal</p>
        <p className="font-semibold">$10,500.00</p>
      </div>
      <div className="flex justify-between mb-2">
        <p className="text-gray-600">Tax</p>
        <p className="font-semibold">$1,050.00</p>
      </div>
      <div className="flex justify-between mb-2">
        <p className="text-gray-600">Discount</p>
        <p className="font-semibold text-red-600">- 10%</p>
      </div>
      <div className="flex justify-between border-t pt-2 mt-2">
        <p className="text-lg font-bold">Total</p>
        <p className="text-lg font-bold text-blue-600">$11,550.00</p>
      </div>
    </div>

    <div className="text-center text-xs text-gray-500 mt-6 pt-4 border-t">
      <p>
        Please pay the invoice before the due date. You can pay via our client
        portal.
      </p>
    </div>
  </div>
));

export default Invoice;
