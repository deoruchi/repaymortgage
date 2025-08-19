import { useState } from "react";
import Calc_Icon from "../assets/images/icon-calculator.svg";
import Calculator_img from "../assets/images/illustration-empty.svg";
export default function Calculator() {
  const [amount, setAmount] = useState<number | "">("");
  const [term, setTerm] = useState<number | "">("");
  const [interest, setInterest] = useState<number | "">("");
  const [mortgagetype, setMortgageType] = useState<string>("");

  const [result, setResult] = useState<boolean>(false);
  const [mortagageRepayment, setMortgageRepayement] = useState<{
    monthlyRepayment: string;
    yearlyRepayment: string;
  }>({ monthlyRepayment: "", yearlyRepayment: "" });

  const [errorAmount, setErrorAmount] = useState(false);
  const [errorTerm, setErrorTerm] = useState(false);
  const [errorInterest, setErrorInterest] = useState(false);
  const [errorRadio, setErrorRadio] = useState(false);

  // function to calculate the repayement type of mortagage
  const calculateRepayement = (
    monthlyInt: number,
    numbPytms: number
  ): { monthlyRepayment: number; yearlyRepayment: number } => {
    let monthlyRepayment;
    let yearlyRepayment;

    if (amount === "") return { monthlyRepayment: 0, yearlyRepayment: 0 };

    if (monthlyInt === 0) {
      monthlyRepayment = amount / numbPytms;
      yearlyRepayment = amount;
    } else {
      monthlyRepayment =
        (amount * (monthlyInt * Math.pow(1 + monthlyInt, numbPytms))) /
        (Math.pow(1 + monthlyInt, numbPytms) - 1);

      yearlyRepayment = monthlyRepayment * numbPytms;
    }
    return { monthlyRepayment, yearlyRepayment };
  };

  // function to calculate the repayment type of interest only
  const calculateInterest = (
    monthlyInt: number,
    numbPytms: number
  ): { monthlyRepayment: number; yearlyRepayment: number } => {
    if (amount === "") {
      return { monthlyRepayment: 0, yearlyRepayment: 0 };
    } else {
      const monthlyRepayment = amount * monthlyInt;
      const yearlyRepayment = monthlyRepayment * numbPytms + amount;
      return { monthlyRepayment, yearlyRepayment };
    }
  };

  // function to cal. the repayments
  const calculateRepayment = () => {
    setErrorAmount(false);
    setErrorTerm(false);
    setErrorInterest(false);
    setErrorRadio(false);

    let hasError = false;

    // Validate each field
    if (typeof amount !== "number" || amount <= 0) {
      setErrorAmount(true);
      hasError = true;
    }
    if (typeof term !== "number" || term <= 0) {
      setErrorTerm(true);
      hasError = true;
    }
    if (typeof interest !== "number" || interest <= 0) {
      setErrorInterest(true);
      hasError = true;
    }

    if (typeof mortgagetype !== "string" || mortgagetype === "") {
      setErrorRadio(true);
      hasError = true;
    }

    // If any error exists, stop the function
    if (hasError) {
      return;
    }

    // Convert interest and term to numbers, handling potential empty strings or NaNs
    const interestNumber = Number(interest);
    const termNumber = Number(term);

    // Add validation to ensure they are valid numbers
    if (
      isNaN(interestNumber) ||
      isNaN(termNumber) ||
      interestNumber === 0 ||
      termNumber === 0
    ) {
      //   alert("Please ensure all fields are filled with valid numbers.");
      return;
    }

    const annualInterestRate = interestNumber / 100;
    const monthlyInterestRate = annualInterestRate / 12;
    const numberOfPayments = termNumber * 12;

    let amounts!: { monthlyRepayment: number; yearlyRepayment: number };

    switch (mortgagetype) {
      case "repayment":
        amounts = calculateRepayement(monthlyInterestRate, numberOfPayments);

        break;

      case "interest_only":
        amounts = calculateInterest(monthlyInterestRate, numberOfPayments);
        break;
    }

    if (amounts.yearlyRepayment > 0 && amounts.monthlyRepayment > 0) {
      console.log(amounts);
      setResult(true);
      const m = Math.round(amounts.monthlyRepayment * 100).toLocaleString(
        "en-GB"
      );
      const y = Math.round(amounts.yearlyRepayment * 100).toLocaleString(
        "en-GB"
      );
      console.log(m, y);
      setMortgageRepayement({
        monthlyRepayment: m,
        yearlyRepayment: y,
      });
    }
  };

  // function to clear the inputs
  const clearAll = () => {
    setAmount("");
    setTerm("");
    setMortgageType("");
    setInterest("");
    setResult(false);
    setMortgageRepayement({ monthlyRepayment: "", yearlyRepayment: "" });

    setErrorAmount(false);
    setErrorInterest(false);
    setErrorTerm(false);
    setErrorRadio(false);
  };

  return (
    <>
      <section
        className=" 
            flex flex-col md:flex-row  justify-between  
            bg-white md:rounded-2xl w-full
            shadow-md md:px-0 scroll-mt-80px 
            md:w-6/11
            h-auto
            "
      >
        {/* Calculator section */}
        <div className="w-full md:w-1/2 p-4 md:py-8 md:px-8 ">
          <div className="flex flex-row justify-between mb-1">
            <p
              className="
            text-Slate-900 font-bold text-xl
            "
            >
              Mortgage Calculator
            </p>

            <button
              onClick={clearAll}
              className="
                text-Slate-500 underline hover:text-Slate-900
                cursor-pointer
                "
            >
              Clear All
            </button>
          </div>


          <form className="space-y-3 text-sm py-2 text-left flex flex-col gap-2 mb-1">
            {/* Mortgage Amount */}
            <div>
              <p id="mortageAmount" className="block text-Slate-500 mb-0.5 font-medium">
                Mortgage Amount
              </p>

              <div className="flex group w-full">
                <span
                  className={` 
                        flex items-center px-3 py-1.5
                        bg-Slate-100 text-Slate-500 font-medium border-l border-t border-b rounded-l-md 
                        input-icon
                        ${
                          errorAmount
                            ? `bg-red text-white border-red`
                            : `bg-Slate-100 border-Slate-400`
                        }
                        `}
                >
                  £
                </span>

                <input
                  type="number"
                  id="moertageAmout"
                  className={`
                        flex-1 p-2 
                        border-t border-r border-b 
                        ${
                          errorAmount ? `border-red` : `border-Slate-500`
                        }  rounded-r-md  
                        text-box-border
                        `}
                  value={amount}
                  onChange={(e) =>
                    setAmount(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                />
              </div>
              {errorAmount ? (
                <p className="text-red">This field is required.</p>
              ) : (
                <></>
              )}
            </div>

            {/* Mortgage Term and Interest Rate */}
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {/* Mortgage Term */}
              <div className="flex flex-col">
                <label
                  id="moertagageTerm"
                  className="text-Slate-500 mb-1  font-medium"
                >
                  Mortgage Term
                </label>

                <div className="flex group">
                  <input
                    type="number"
                    id="moertgageTerm"
                    min="0"
                    value={term}
                    onChange={(e) => setTerm(Number(e.target.value))}
                    className={`
                        w-full px-3 py-2 
                        border-t border-l border-b rounded-l-md  text-box-border
                        ${errorTerm ? `border-red` : `border-Slate-500`}
                        `}
                  />

                  <span
                    className={`flex items-center px-3 
                          text-Slate-500 font-medium border-r border-t border-b  rounded-r-md 
                        input-icon
                        ${
                          errorTerm
                            ? `border-red text-white bg-red`
                            : ` border-Slate-500 bg-Slate-100`
                        }
                        `}
                  >
                    years
                  </span>
                </div>
                {errorTerm ? (
                  <p className="text-red">This field is required.</p>
                ) : (
                  <></>
                )}
              </div>

              {/* Interest Rate */}
              <div className="flex flex-col">
                <label
                  id="moertagageTerm"
                  className="text-Slate-500 mb-1  font-medium"
                >
                  Interest Rate
                </label>

                <div className="flex group">
                  <input
                    type="number"
                    id="moertgageTerm"
                    min="0"
                    value={interest}
                    onChange={(e) => setInterest(Number(e.target.value))}
                    className={`w-full px-3 py-2 border-t border-l border-b rounded-l-md text-box-border 
                        ${errorInterest ? "border-red" : "border-Slate-500"}
                        `}
                  />

                  <span
                    className={` flex items-center px-3  text-Slate-500  font-medium border-r border-t border-b  rounded-r-md input-icon
                    ${
                      errorInterest
                        ? `border-red text-white bg-red`
                        : `bg-Slate-100 border-Slate-500`
                    }
                    `}
                  >
                    %
                  </span>
                </div>
                {errorInterest ? (
                  <p className="text-red">This field is required.</p>
                ) : (
                  <></>
                )}
              </div>
            </div>

            {/* Mortgage Type */}
            <div className="flex flex-col text-left gap-2">
              <label className="text-Slate-500 font-medium">
                Mortgage Type
              </label>

              {/* radio button : 1 */}
              <label
                className="
                    flex items-center gap-2
                    border rounded-md p-2 bg-white cursor-pointer
                    transition-colors
                
                    has-[:checked]:border-lime
                    has-[:checked]:bg-lime-50
                    not-has-[:checked]:border-Slate-500
                    hover:border-lime
                    "
              >
                <input
                  type="radio"
                  id="repay"
                  name="mortgageType"
                  value="repayment"
                  checked={mortgagetype === "repayment"}
                  onChange={(e) => setMortgageType(e.target.value)}
                />

                <span className="font-bold text-Slate">Repayment</span>
              </label>

              {/* radio button : 2 */}
              <label
                className="
                    flex items-center gap-2
                    border rounded-md p-2 bg-white cursor-pointer
                    transition-colors
                
                    has-[:checked]:border-lime
                    has-[:checked]:bg-lime-50
                    not-has-[:checked]:border-Slate-500
                    hover:border-lime
                    "
              >
                <input
                  type="radio"
                  id="repay"
                  name="mortgageType"
                  value="interest_only"
                  checked={mortgagetype === "interest_only"}
                  onChange={(e) => setMortgageType(e.target.value)}
                />
                <span className="font-bold text-Slate">Interest Only</span>
              </label>
              {errorRadio ? (
                <p className="text-red">This field is required</p>
              ) : (
                <></>
              )}
            </div>
          </form>


          {/* Calculate Button */}
          <button
            onClick={calculateRepayment}
            className="
                bg-lime p-2 w-full md:w-2/3 mx-auto md:mx-0
                font-bold text-Slate-900
                rounded-4xl 

                flex flex-row gap-1 justify-center items-center
                hover:bg-lime-hover
                cursor-pointer

                py-1.5 text-sm
            "
          >
            <img src={Calc_Icon} alt="calculator icon" />
            Calculate Repayments
          </button>

        </div>

        {/* Result Section */}

        <div
          className=" 
                flex-1 bg-Slate-900 text-white 
                md:rounded-br-2xl md:rounded-tr-2xl md:rounded-bl-[50px]
                flex flex-col items-center justify-center
                
                "
        >
          {result === false ? (
            <div
              className="
                p-4 md:p-2 mx-auto
                flex flex-col items-center justify-center text-center 
                "
            >
              {/* Result Not Calulated : empty state */}
              <img
                src={Calculator_img}
                alt="calculator picture"
                className="h-32 w-auto object-contain mt-2"
              />

              <div className="flex flex-col justify-center p-5 gap-2">
                <h3 className="font-semibold text-xl ">Results shown here</h3>

                <p className="text-Slate-300 text-l">
                  Complete the form and click "calculate repayments" to see what
                  you monthly repayements would be.
                </p>
              </div>
            </div>
          ) : (
            <div className=" flex flex-col items-start gap-6 p-4 md:py-4 md:px-8">
              {/* Reuslt Calculated */}

              <div className="text-left">
                <p className="text-2xl font-semibold mb-2">Your results</p>

                <p className="text-Slate-300 md:text-sm">
                  Your results are shown below based on the information you
                  provided. To adjust the results, edit the form and click
                  "calculate repayments" again.
                </p>
              </div>

              <div
                className="
                    w-full p-6 md:p-4
                    bg-Slate-910 rounded-lg 
                    flex flex-col gap-4
                    border-t-6 border-lime
                "
              >
                {/* Amount Display Section */}
                <div className="text-left">
                  <p className="text-Slate-500 font-semibold mb-1">
                    Your monthly repayments
                  </p>

                  <p className="text-4xl md:text-5xl font-semibold text-lime mb-2">
                    £{mortagageRepayment.monthlyRepayment}
                  </p>
                </div>

                <hr className="border-Slate-700 mb-1" />

                <div className="text-left">
                  <p className="text-Slate-500 font-semibold ">
                    Total you'll repay over the term
                  </p>

                  <p className="text-2xl font-bold ">
                    £{mortagageRepayment.yearlyRepayment}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
