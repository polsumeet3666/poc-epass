#!/bin/bash

set -e


CONFIG_ROOT=/opt/gopath/src/github.com/hyperledger/fabric/peer
ORG1_MSPCONFIGPATH=${CONFIG_ROOT}/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
ORG1_TLS_ROOTCERT_FILE=${CONFIG_ROOT}/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
ORG2_MSPCONFIGPATH=${CONFIG_ROOT}/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
ORG2_TLS_ROOTCERT_FILE=${CONFIG_ROOT}/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
ORDERER_TLS_ROOTCERT_FILE=${CONFIG_ROOT}/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
set -x

echo "createRequest"
echo "Submitting createRequest transaction to smart contract on mychannel"
echo "The transaction is sent to all of the peers so that chaincode is built before receiving the following requests"


docker exec \
  -e CORE_PEER_LOCALMSPID=Org1MSP \
  -e CORE_PEER_MSPCONFIGPATH=${ORG1_MSPCONFIGPATH} \
  cli \
  peer chaincode invoke \
    -o orderer.example.com:7050 \
    -C mychannel \
    -n epass \
    -c '{"function":"createRequest","Args":["{\"_id\":\"5e997f8ea1c75229f662ae57\",\"district\":\"Akola\",\"isinter_state\":\"0\",\"name\":\"john doe 3\",\"essential_service_type\":\"Bank/Finanace/ATM\",\"vehicle_number\":\"mh 02 ad 0123\",\"mobile_number\":\"9090909090\",\"email_id\":\"john.deo@gmail.com\",\"from_date\":\"2020-04-01\",\"to_date\":\"2020-04-15\",\"purpose\":\"critical resource\",\"address\":\"21/b baker street london\",\"vehicle_type\":\"2 wheeler\",\"starting_point\":\"Pune\",\"destination\":\"Mumbai\",\"is_home_quarantine\":\"No\",\"is_criminial_background\":\"No\",\"attached_file\":\"datauri\",\"attachde_document\":\"datauire\",\"token\":\"5c56703f-3bef-47e3-a6b0-42c48c4df7fd\",\"status\":\"\",\"approved_by\":\"\"}"]}' \
    --waitForEvent \
    --tls \
    --cafile ${ORDERER_TLS_ROOTCERT_FILE} \
    --peerAddresses peer0.org1.example.com:7051 \
    --peerAddresses peer1.org1.example.com:8051 \
    --peerAddresses peer0.org2.example.com:9051 \
    --peerAddresses peer1.org2.example.com:10051 \
    --tlsRootCertFiles ${ORG1_TLS_ROOTCERT_FILE} \
    --tlsRootCertFiles ${ORG1_TLS_ROOTCERT_FILE} \
    --tlsRootCertFiles ${ORG2_TLS_ROOTCERT_FILE} \
    --tlsRootCertFiles ${ORG2_TLS_ROOTCERT_FILE}
set +x

sleep 10









echo "queryRequest"
echo "Submitting queryRequest transaction to smart contract on mychannel"
echo "The transaction is sent to all of the peers so that chaincode is built before receiving the following requests"


docker exec \
  -e CORE_PEER_LOCALMSPID=Org1MSP \
  -e CORE_PEER_MSPCONFIGPATH=${ORG1_MSPCONFIGPATH} \
  cli \
  peer chaincode invoke \
    -o orderer.example.com:7050 \
    -C mychannel \
    -n epass \
    -c '{"function":"queryRequest","Args":["5c56703f-3bef-47e3-a6b0-42c48c4df7fd"]}' \
    --waitForEvent \
    --tls \
    --cafile ${ORDERER_TLS_ROOTCERT_FILE} \
    --peerAddresses peer0.org1.example.com:7051 \
    --peerAddresses peer1.org1.example.com:8051 \
    --peerAddresses peer0.org2.example.com:9051 \
    --peerAddresses peer1.org2.example.com:10051 \
    --tlsRootCertFiles ${ORG1_TLS_ROOTCERT_FILE} \
    --tlsRootCertFiles ${ORG1_TLS_ROOTCERT_FILE} \
    --tlsRootCertFiles ${ORG2_TLS_ROOTCERT_FILE} \
    --tlsRootCertFiles ${ORG2_TLS_ROOTCERT_FILE}
set +x

sleep 10








echo "approveRequest"
echo "Submitting approveRequest transaction to smart contract on mychannel"
echo "The transaction is sent to all of the peers so that chaincode is built before receiving the following requests"


docker exec \
  -e CORE_PEER_LOCALMSPID=Org1MSP \
  -e CORE_PEER_MSPCONFIGPATH=${ORG1_MSPCONFIGPATH} \
  cli \
  peer chaincode invoke \
    -o orderer.example.com:7050 \
    -C mychannel \
    -n epass \
    -c '{"function":"approveRequest","Args":["5c56703f-3bef-47e3-a6b0-42c48c4df7fd","SP"]}' \
    --waitForEvent \
    --tls \
    --cafile ${ORDERER_TLS_ROOTCERT_FILE} \
    --peerAddresses peer0.org1.example.com:7051 \
    --peerAddresses peer1.org1.example.com:8051 \
    --peerAddresses peer0.org2.example.com:9051 \
    --peerAddresses peer1.org2.example.com:10051 \
    --tlsRootCertFiles ${ORG1_TLS_ROOTCERT_FILE} \
    --tlsRootCertFiles ${ORG1_TLS_ROOTCERT_FILE} \
    --tlsRootCertFiles ${ORG2_TLS_ROOTCERT_FILE} \
    --tlsRootCertFiles ${ORG2_TLS_ROOTCERT_FILE}
set +x

sleep 10






echo "queryRequest"
echo "Submitting queryRequest transaction to smart contract on mychannel"
echo "The transaction is sent to all of the peers so that chaincode is built before receiving the following requests"


docker exec \
  -e CORE_PEER_LOCALMSPID=Org1MSP \
  -e CORE_PEER_MSPCONFIGPATH=${ORG1_MSPCONFIGPATH} \
  cli \
  peer chaincode invoke \
    -o orderer.example.com:7050 \
    -C mychannel \
    -n epass \
    -c '{"function":"queryRequest","Args":["5c56703f-3bef-47e3-a6b0-42c48c4df7fd"]}' \
    --waitForEvent \
    --tls \
    --cafile ${ORDERER_TLS_ROOTCERT_FILE} \
    --peerAddresses peer0.org1.example.com:7051 \
    --peerAddresses peer1.org1.example.com:8051 \
    --peerAddresses peer0.org2.example.com:9051 \
    --peerAddresses peer1.org2.example.com:10051 \
    --tlsRootCertFiles ${ORG1_TLS_ROOTCERT_FILE} \
    --tlsRootCertFiles ${ORG1_TLS_ROOTCERT_FILE} \
    --tlsRootCertFiles ${ORG2_TLS_ROOTCERT_FILE} \
    --tlsRootCertFiles ${ORG2_TLS_ROOTCERT_FILE}
set +x

sleep 10

