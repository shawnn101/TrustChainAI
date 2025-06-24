"use client"

import { useState } from "react"
import { Receipt, BookOpen, TrendingUp, Upload, ArrowLeft, Eye, AlertTriangle } from "lucide-react"

const App = () => {
  const [currentPage, setCurrentPage] = useState("home")
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: 1,
      name: "Restaurant Receipt - 2024-06-15",
      preview: "Mario's Italian Bistro - Total: $45.67",
      issues: ["Duplicate charge on appetizer", "Tax calculation error", "Missing date stamp"],
      status: "flagged",
    },
    {
      id: 2,
      name: "Office Supplies - 2024-06-10",
      preview: "OfficeMax Purchase - Total: $127.43",
      issues: ["Item quantity mismatch", "Pricing inconsistency"],
      status: "flagged",
    },
    {
      id: 3,
      name: "Gas Station Receipt - 2024-06-08",
      preview: "Shell Gas Station - Total: $52.18",
      issues: [],
      status: "verified",
    },
  ])
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      // Simulate file processing
      const newFile = {
        id: uploadedFiles.length + 1,
        name: file.name,
        preview: `${file.name} - Processing complete`,
        issues: Math.random() > 0.5 ? ["Sample issue detected"] : [],
        status: Math.random() > 0.5 ? "flagged" : "verified",
      }
      setUploadedFiles([...uploadedFiles, newFile])
      alert(`File "${file.name}" uploaded successfully!`)
    }
  }

  const renderHome = () => (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    
      <header className="flex justify-between items-center p-6">
        <div>
          <img
  src="/logo-removebg-preview.png"
  alt="TrustChainAI Logo"
  className="w-24 h-auto max-h-16 object-contain mr-4"
/>

        </div>
        <button
  className="px-6 py-2 rounded-lg font-medium border border-gray-300 flex items-center justify-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
  style={{
    backgroundColor: "rgba(255, 255, 255, 0.1)", //white with transparency
    backdropFilter: "blur(6px)", //with transparency
    color: "black",
  }}
>
  Sign In
</button>


      </header>

      <main className="flex flex-col items-center justify-center px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">TrustChainAI</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Upload, verify, and analyze your receipts with AI-powered{" "}
            <span className="text-red-500">
              <i>fraud detection</i>
            </span>{" "}
            and comprehensive analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl w-full">
          <div className="text-center group">
            <button
              onClick={() => setCurrentPage("upload")}
              className="w-32 h-32 bg-transparent hover:bg-white rounded-3xl border-2 border-gray-100 hover:border-blue-300 flex items-center justify-center mb-4 mx-auto transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <Receipt
                className="w-12 h-12 text-blue-600 hover:text-blue-700 transition-all duration-300 transform hover:scale-110"
              />
            </button>

            <h3 className="text-xl font-semibold text-blue-800 mb-2"> Upload Receipt(s) </h3>
            <p className="text-blue-600">Drag and drop your receipts for instant analysis</p>
          </div>

          <div className="text-center group">
            <button
              onClick={() => setCurrentPage("history")}
              className="w-32 h-32 bg-transparent hover:bg-white rounded-3xl border-2 border-gray-100 hover:border-green-300 flex items-center justify-center mb-4 mx-auto transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <BookOpen className="w-12 h-12 text-green-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl:text-green-700" />
            </button>
            <h3 className="text-xl font-semibold text-green-800 mb-2">Verification History</h3>
            <p className="text-green-600 ">Review past submissions and audit results</p>
          </div>

          <div className="text-center group">
            <button
              onClick={() => setCurrentPage("analytics")}
              className="w-32 h-32 bg-transparent hover:bg-white rounded-3xl border-2 border-gray-100 hover:border-purple-300 flex items-center justify-center mb-4 mx-auto transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <TrendingUp className="w-12 h-12 text-purple-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl:text-purple-700" />
            </button>
            <h3 className="text-xl font-semibold text-purple-800 mb-2">Analytics</h3>
            <p className="text-purple-600">Insights and trends from your audit data</p>
          </div>
        </div>
      </main>
    </div>
  )

  const renderUpload = () => (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="flex items-center p-6">
<button
  onClick={() => setCurrentPage("home")}
  className="flex items-center mr-4 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-gray-300"
  style={{
    backgroundColor: "#000", // solid black
    backdropFilter: "blur(6px)", // with transparency
    color: "white",
  }}
>
  <ArrowLeft className="w-5 h-5 mr-2 text-white" />
  Back to Home
</button>

        <div className="text-2xl font-bold text-gray-800">Upload Receipt</div>
      </header>

      <main className="flex flex-col items-center justify-center px-6 py-20">
        <div
          className={`w-full max-w-2xl h-96 border-3 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-105 ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-25"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className={`w-16 h-16 mb-4 ${dragActive ? "text-blue-500" : "text-gray-400"}`} />
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            {dragActive ? "Drop your file here" : "Drag & Drop your receipt"}
          </h3>
          <p className="text-gray-600 mb-6">Supports PDF, PNG, JPG, and text documents</p>
<input
  type="file"
  id="fileUpload"
  className="hidden"
  onChange={(e) => {
    const file = e.target.files[0]
    if (file) {
      const newFile = {
        id: uploadedFiles.length + 1,
        name: file.name,
        preview: `${file.name} - Processing complete`,
        issues: Math.random() > 0.5 ? ["Sample issue detected"] : [],
        status: Math.random() > 0.5 ? "flagged" : "verified",
      }
      setUploadedFiles([...uploadedFiles, newFile])
      alert(`File "${file.name}" uploaded successfully!`)
    }
  }}
/>

<button
  onClick={() => document.getElementById("fileUpload").click()}
  className="bg-transparent hover:bg-white text-white hover:text-white px-8 py-3 rounded-lg font-medium border-2 border-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
>
  Or Browse Files
</button>

        </div>

        <div className="mt-12 text-center">
          <h4 className="text-lg font-medium text-gray-800 mb-4">What happens next?</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 transition-all duration-300 transform hover:scale-110">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <p className="text-sm text-gray-600">AI analyzes your receipt</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 transition-all duration-300 transform hover:scale-110">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <p className="text-sm text-gray-600">Flags suspicious items</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 transition-all duration-300 transform hover:scale-110">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <p className="text-sm text-gray-600">Provides detailed report</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )

  const renderHistory = () => (
  <div className="min-h-screen min-w-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <header className="flex items-center p-6">
<button
  onClick={() => setCurrentPage("home")}
  className="flex items-center mr-4 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-gray-300"
  style={{
    backgroundColor: "#000", // solid black
    backdropFilter: "blur(6px)",
    color: "white",
  }}
>
  <ArrowLeft className="w-5 h-5 mr-2 text-white" />
  Back to Home
</button>

      <div className="text-2xl font-bold text-gray-800">Verification History</div>
    </header>

    <main className="px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Submitted Documents</h2>
          <p className="text-gray-600">Click on any document to view detailed audit results</p>
        </div>

        <div className="space-y-4">
          {uploadedFiles.map((file) => (
            <button
              key={file.id}
              onClick={() => {
                setSelectedDocument(file)
                setCurrentPage("document-detail")
              }}
              className="w-full rounded-xl p-6 text-left border border-gray-300 hover:border-blue-300 shadow-md transition-all duration-300 transform hover:scale-105"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(6px)",
                color: "black"
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">{file.name}</h3>
                  <p className="mb-2">{file.preview}</p>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        file.status === "flagged"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {file.status === "flagged" ? "Issues Found" : "Verified"}
                    </span>
                    {file.issues.length > 0 && (
                      <span className="text-sm text-gray-700">
                        {file.issues.length} issue{file.issues.length !== 1 ? "s" : ""} detected
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <Eye className="w-5 h-5 text-gray-500" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  </div>
)


  const renderDocumentDetail = () => (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="flex items-center p-6">
<button
  onClick={() => setCurrentPage("home")}
  className="flex items-center mr-4 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-gray-300"
  style={{
    backgroundColor: "#000", // solid black
    backdropFilter: "blur(6px)",
    color: "white",
  }}
>
  <ArrowLeft className="w-5 h-5 mr-2 text-white" />
  Back to History
</button>

        <div className="text-2xl font-bold text-gray-800">Document Analysis</div>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedDocument?.name}</h2>
            <p className="text-gray-600">{selectedDocument?.preview}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Document Preview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Document Preview</h3>
              <div className="bg-gray-50 rounded-lg p-6 font-mono text-sm">
                <div className="space-y-2">
                  <div>Mario's Italian Bistro</div>
                  <div>123 Main Street, City</div>
                  <div>Date: June 15, 2024</div>
                  <div className="border-t pt-2 mt-4">
                    <div className="flex justify-between">
                      <span>Appetizer</span>
                      <span className="bg-red-100 text-red-700 px-2 rounded">$12.99</span>
                    </div>
                    <div className="flex justify-between text-red-600 font-bold">
                      <span>Appetizer (Duplicate)</span>
                      <span className="bg-red-100 text-red-700 px-2 rounded">$12.99</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Main Course</span>
                      <span>$18.99</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Beverage</span>
                      <span>$4.99</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>$49.96</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Tax (Incorrect)</span>
                        <span className="bg-red-100 text-red-700 px-2 rounded">$2.71</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>$45.67</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Issues Found */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Issues Detected</h3>
              <div className="space-y-4">
                {selectedDocument?.issues.map((issue, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg border border-red-200"
                  >
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-red-800">{issue}</h4>
                      <p className="text-sm text-red-600 mt-1">
                        {index === 0 &&
                          "This item appears twice on the receipt, potentially indicating an error or fraudulent activity."}
                        {index === 1 &&
                          "The tax calculation doesn't match the expected rate for this location and item total."}
                        {index === 2 && "Receipt is missing required date/time stamp for proper verification."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Recommendations</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Verify the duplicate charge with the merchant</li>
                  <li>• Request a corrected receipt with proper tax calculation</li>
                  <li>• Ensure future receipts include complete timestamp information</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )

  const renderAnalytics = () => (
    <div className="min-h-screen min-w-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="flex items-center p-6">
<button
  onClick={() => setCurrentPage("home")}
  className="flex items-center mr-4 px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-gray-300"
  style={{
    backgroundColor: "#000", // solid black
    backdropFilter: "blur(6px)",
    color: "white",
  }}
>
  <ArrowLeft className="w-5 h-5 mr-2 text-white" />
  Back to Home
</button>

        <div className="text-2xl font-bold text-gray-800">Analytics Dashboard</div>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Audit Insights & Trends</h2>
            <p className="text-gray-600">Analyze patterns in your document audits to improve accuracy</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Documents</p>
                  <p className="text-3xl font-bold text-gray-900">247</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Issues Found</p>
                  <p className="text-3xl font-bold text-red-600">89</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Accuracy Rate</p>
                  <p className="text-3xl font-bold text-green-600">64%</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Processing</p>
                  <p className="text-3xl font-bold text-purple-600">2.3s</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Most Common Issues</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tax Calculation Errors</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: "68%" }}></div>
                    </div>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duplicate Charges</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Missing Information</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "32%" }}></div>
                    </div>
                    <span className="text-sm font-medium">32%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Price Discrepancies</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "28%" }}></div>
                    </div>
                    <span className="text-sm font-medium">28%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Improvement Recommendations</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">Focus on Tax Verification</h4>
                  <p className="text-sm text-blue-600">
                    68% of issues are tax-related. Implement stricter tax calculation checks.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">Duplicate Detection</h4>
                  <p className="text-sm text-green-600">
                    Enhance algorithms to catch duplicate line items more effectively.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-800 mb-2">Data Completeness</h4>
                  <p className="text-sm text-purple-600">
                    Require mandatory fields to reduce missing information errors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )

  // Render the appropriate page based on current state
  switch (currentPage) {
    case "upload":
      return renderUpload()
    case "history":
      return renderHistory()
    case "document-detail":
      return renderDocumentDetail()
    case "analytics":
      return renderAnalytics()
    default:
      return renderHome()
  }
}

export default App