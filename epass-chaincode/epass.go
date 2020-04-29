package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

// Request - applicant state
type Request struct {
	District             string `json:"district"`
	IsInterState         string `json:"isinter_state"`
	Name                 string `json:"name"`
	EssentialServiceType string `json:"essential_service_type"`
	VehicleNumber        string `json:"vehicle_number"`
	MobileNumber         string `json:"mobile_number"`
	EmailID              string `json:"email_id"`
	FromDate             string `json:"from_date"`
	ToDate               string `json:"to_date"`
	Purpose              string `json:"purpose"`
	Address              string `json:"address"`
	VehicleType          string `json:"vehicle_type"`
	StartingPoint        string `json:"starting_point"`
	Destination          string `json:"destination"`
	NoCoPassenger        string `json:"no_co_passenger"`
	IsHomeQuarantine     string `json:"is_home_quarantine"`
	IsCriminalBackground string `json:"is_criminial_background"`
	AttachedFile         string `json:"attached_file"`
	AttachedDoc          string `json:"attachde_document"`
	Token                string `json:"token"`
	Status               string `json:"status"`
	ApprovedBy           string `json:"approved_by"`
}

// SmartContract define the smart contract structure
type SmartContract struct {
}

// Init sm
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) peer.Response {
	fmt.Println("cc init")
	return shim.Success(nil)
}

// InitLedger best practise to initledge here
func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) peer.Response {
	fmt.Println("cc initledger")
	// init chaincode here
	return shim.Success(nil)
}

// Invoke method is called as a result of an application request to run sm
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) peer.Response {

	// get requested sm fn and args
	function, args := APIstub.GetFunctionAndParameters()

	fmt.Printf("cc invoke - function -%s \n", function)
	fmt.Printf("cc invoke - args -%s \n", args)

	// route to approproate handler function to interact with ledger

	if function == "createRequest" {
		return s.createRequest(APIstub, args)
	} else if function == "approveRequest" {
		return s.approveRequest(APIstub, args)
	} else if function == "queryRequest" {
		return s.queryRequest(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	}
	// else if function == "queryAllRequest" {
	// 	return s.queryAllRequest(APIstub, args)
	// }

	return shim.Error("Invalid Smart Contract function name.")
}

func (s *SmartContract) createRequest(APIstub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of args. expecting 1")
	}

	jsonObjString := args[0]
	var req Request
	json.Unmarshal([]byte(jsonObjString), &req)

	// convert into bytes
	reqAsBytes, _ := json.Marshal(req)
	// save on dlt
	APIstub.PutState(req.Token, reqAsBytes)

	return shim.Success(nil)
}

func (s *SmartContract) queryRequest(APIstub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	reqAsBytes, _ := APIstub.GetState(args[0])
	return shim.Success(reqAsBytes)
}

func (s *SmartContract) approveRequest(APIstub shim.ChaincodeStubInterface, args []string) peer.Response {
	// tokenid,approverid

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	reqAsBytes, _ := APIstub.GetState(args[0])
	req := Request{}

	json.Unmarshal(reqAsBytes, &req)
	req.Status = "approved"
	req.ApprovedBy = args[1]

	reqAsBytes, _ = json.Marshal(req)
	APIstub.PutState(args[0], reqAsBytes)

	return shim.Success(reqAsBytes)
}

func main() {
	// create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart contract :%s", err)
	}

}
