import React from 'react';
import Cookies from 'js-cookie';

import PropTypes from 'prop-types';
// import WholeSummary from '../wholeSummary/wholeSummary';

// import styles from './style.scss';

class ItemElement extends React.Component{
    constructor(){
        super()
        this.state={
            isEditMode: false,
        }
    }

    editItemHandler=()=>{
        // console.log('HELLO EDITTING');
        // console.log(this.props);
        this.setState( {isEditMode: !this.state.isEditMode} );
    }

    updateItemHandler = (e) =>{
        // console.log('HELLO UPDATEEE');
        // console.log(this.refs.input.value);
        if(e.keyCode === 13){

            this.setState({
                isEditMode:false,
            })

            let itemEdited = this.refs.input.value;

            let itemElement = [];

            itemElement.push(this.props.id);
            itemElement.push(this.props.type);

            this.props.pickMeUp(itemEdited,itemElement);
        }
    }

    test = ()=>{
        console.log('OUT OF FOCUSSSS');
    }

    renderEditView(item){
        if (typeof item == 'number' && this.props.type == 'price'){
            item = item.toFixed(2);
        };
        return  <td>
                    <input id={this.props.id} type={this.props.type} defaultValue={item} ref="input" onKeyDown={(e)=>{this.updateItemHandler(e)}} onBlur={()=>{this.test()}}/>
                </td>
    }

    renderDefaultView=(item)=>{
        if (typeof item == 'number' && this.props.type == 'price'){
            item = item.toFixed(2);
        };
        return <td onClick={(e)=>{this.editItemHandler(e)}}>{item}</td>
    }

    render(){
        const item = this.props.item;
        const editState = this.state.isEditMode;

        return editState ?
            this.renderEditView(item) : this.renderDefaultView(item)
    }
}

class ItemRow extends React.Component{
    constructor(){
        super()
        this.state={
            status:false,
        }
    }
    render(){

        let quantity = "quantity";
        let item_name = "item_name";
        let price = "price";
        console.log(this.props.item.item_name)
        return(
            <tr>
                <ItemElement id={this.props.id} type={quantity} item={this.props.item.quantity} pickMeUp={this.props.pickMeUp} status={this.state.status}/>
                <ItemElement id={this.props.id} type={item_name} item={this.props.item.item_name} pickMeUp={this.props.pickMeUp} status={this.state.status}/>
                <ItemElement id={this.props.id} type={price} item={this.props.item.price} pickMeUp={this.props.pickMeUp} status={this.state.status}/>
            </tr>
        );
    }
}

class ItemTable extends React.Component{
    render(){
        const rows = [];
        this.props.items.forEach((item,index)=>{
            rows.push(
                <ItemRow
                    item={item}
                    id={index}
                    key={index}
                    pickMeUp={this.props.pickMeUp}/>
                )
        })
        return(
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Item</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
}

class PaymentSummary extends React.Component{
    constructor(){
        super();
    }
    render(){

        return(
            <table>
                <thead>
                </thead>
                <tbody>
                    <tr>
                        <td>Sub-Total: </td>
                        <td>$ {this.props.payment.subtotal}</td>
                    </tr>
                    <tr>
                        <td>Service Charge (10%): </td>
                        <td>$ {this.props.payment.serviceCharge}</td>
                        <td><button onClick={this.props.serviceChargeBooleanHandler}>click</button></td>
                    </tr>
                    <tr>
                        <td>GST (7%): </td>
                        <td>$ {this.props.payment.gst}</td>
                        <td><button  onClick={this.props.gstBooleanHandler}>click</button></td>
                    </tr>
                    <tr>
                        <td>Total: </td>
                        <td>$ {this.props.payment.total}</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

class ButtonProceedTab extends React.Component{
    constructor(){
        super();
    }
    render(){
        return(
            <div>
                <p>Proceed?</p>
                <button onClick={()=>{this.props.updateReceipt()}}><a href="/splitTesting">Yes</a></button>
            </div>
        );
    }
}

class Receipt extends React.Component{
    constructor(){
        super();
    }  //end of constructor
    render(){
        if(this.props.receipt.length === 0){
            return(
                <div>
                    <p></p>
                </div>
            )
        }else {
            return(
                <div>
                    <ItemTable items={this.props.receipt.items} pickMeUp={this.props.pickMeUp}/>
                    <PaymentSummary payment={this.props.receipt}
                      serviceChargeBooleanHandler={this.props.serviceChargeBooleanHandler}
                      gstBooleanHandler={this.props.gstBooleanHandler}/>
                    <ButtonProceedTab updateReceipt={this.props.updateReceipt}/>
                </div>
            )
        }
    }
}

class MainReceipt extends React.Component {
    constructor() {
        super();

        this.state = {
            receipt: null,
            // groupMembers: [],
            hasReceipt: false,

            isLoggedIn: false,

            serviceChargeBoolean: true,
            gstBoolean: true,
        }
    }

    updateReceiptRequest=()=>{

        console.log('send request to update receipt')
        let receipt = this.state.receipt;
        let input = { obj: receipt };

        fetch(`/update/receipt`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(input),
        }).then(res=>console.log('updated receipts'));
        // console.log(res.json())

    }

    updateItemsRequest=()=>{

        console.log('send request to update items');
        let items = this.state.receipt.items;
        let input = {obj : items};
        console.log(input);
        fetch(`/update/items`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(input),
        }).then(res=>console.log('Updated items'));
    }

    updateHandler=()=>{

        console.log('updates receipt and items');
        this.updateReceiptRequest();
        this.updateItemsRequest();

        // window.location.href = '/splitTesting'
    }

    componentDidMount=()=>{
        this.getReceiptHandler();
    }

    // componentWillUnmount = () => {
    // this.mounted = false;
    // clearTimeout(this.timer);
    // };

    getReceiptHandler=()=>{ //clunky way to retrieve backend data on RECEIPT, ITEMS and GroupMembers
        //retrieves receipt and item info
        console.log('SEND AND GET SOMETHING')
        var reactThis = this;
        // var img_token = '280gTIQNwoTQeInc'; // need to find a way to retrieve img token..... !!!!!!!*(****!!!)
        var receipt_id;
        var obj = {};
        // ws06oyvmcgCsdsNL
        // guQnFRzRY4MXMm6F

        async function getReceipt(id){ // async request to backend

            let response = await fetch(`/receipt/${id}`);
            let data = await response.json();
            return data;
        }

        async function getItems(id){ // async request to backend

            let response = await fetch(`/items/${id}`);
            let data = await response.json();
            console.log(data)
            return data;
        }
// Cookies.get('receiptId')
        getReceipt(Cookies.get('receiptId')).then(receiptOutput=> { //sending request to get receipt
            getItems(Cookies.get('receiptId')).then(itemOutput=>{ // sending request to get items

                for(let i=0;i<itemOutput.length;i++){

                    itemOutput[i].item_name =  (itemOutput[i].item_name).replace(/[^a-zA-Z ]/g, "")
                }
                console.log(itemOutput)
                obj =  { // arranging response jsons. Saving obj to this.state.receipt
                    receipt_id: receiptOutput[0].id,
                    user_id: receiptOutput[0].user_id,
                    group_id: receiptOutput[0].group_id,
                    img_token: receiptOutput[0].img_token,
                    subtotal: (receiptOutput[0].subtotal).toFixed(2),
                    serviceCharge: (receiptOutput[0].subtotal*0.1).toFixed(2),
                    gst: (receiptOutput[0].subtotal*0.07).toFixed(2),
                    total: ((receiptOutput[0].subtotal*0.1) + (receiptOutput[0].subtotal*0.07) + (receiptOutput[0].subtotal)).toFixed(2),
                    items: itemOutput,
                    };

                this.setState( {receipt: obj} );
                this.viewReceiptHandler();
                this.doneViewingReceiptHandler();
                 // toggles condition to view receipt component

            })
        })

    }

    viewReceiptHandler =()=>{

        this.setState( {hasReceipt: true} );
        this.quickMath(this.state.serviceChargeBoolean,this.state.gstBoolean)
    }

    doneViewingReceiptHandler = () =>{

        this.setState( {verifyReceipt: true} );
    }

    pickMeUp = (input, itemLocation) =>{ //function to take values from tableElement and update app.jsx's this.state.receipt items

        let latestEdit = input; //user edited input
        let itemId = itemLocation[0]; //which item is this?
        let itemType = itemLocation[1]; //which key is it?

        let receipt = Object.assign({},this.state.receipt);
        if(itemType === 'price' ){
            receipt.items[itemId][`${itemType}`] = Number(Number(latestEdit).toFixed(2));
        }else if(itemType === 'quantity'){
            receipt.items[itemId][`${itemType}`] = Number(latestEdit);
        }else{
            receipt.items[itemId][`${itemType}`] = latestEdit;
        }
        this.setState({receipt});

        console.log(receipt);

        this.quickMath(this.state.serviceChargeBoolean, this.state.gstBoolean);
    }


    quickMath = (serviceChargeBoolean,gstBoolean) =>{ // when user edits receipt, function checks prices and updates state

        let updatedReceiptItems = this.state.receipt;
        let prices = [];

        const reducer = (accumulator, currentValue) => accumulator + currentValue;


        for(let i = 0; i < updatedReceiptItems.items.length; i ++){
            prices.push(updatedReceiptItems.items[i].price);
        }

        let newSubtotal = prices.reduce(reducer);

        let newSc;
        let newGst;

        if (serviceChargeBoolean === true) {
          newSc = newSubtotal * 0.1;
        } else {
          newSc = 0;
        }

        if (gstBoolean === true) {
          newGst = (newSubtotal + newSc) * 0.07;
        } else {
          newGst = 0;
        }

        let newTotal = newSubtotal + newSc + newGst;

        let receipt = Object.assign({},this.state.receipt);
        receipt.subtotal = (newSubtotal).toFixed(2);
        receipt.serviceCharge = (newSc).toFixed(2);
        receipt.gst = (newGst).toFixed(2);
        receipt.total = (newTotal).toFixed(2);

        this.setState({receipt});

    }

    serviceChargeBooleanHandler = (event) => {
      if (this.state.serviceChargeBoolean === true) {
        this.setState({serviceChargeBoolean: false})
        this.quickMath(false,this.state.gstBoolean)
      } else {
        this.setState({serviceChargeBoolean: true})
        this.quickMath(true,this.state.gstBoolean)
      }
    }

    gstBooleanHandler = (event) => {
      if (this.state.gstBoolean === true) {
        this.setState({gstBoolean: false})
        this.quickMath(this.state.serviceChargeBoolean, false)
      } else {
        this.setState({gstBoolean: true})
        this.quickMath(this.state.serviceChargeBoolean, true)
      }
    }

    render() {
      if (this.state.receipt === null){
        return <p>loading</p>
      } else {
        const proceedToReceipt = this.state.hasReceipt;
        // const proceedToItemSelection = this.state.verifyReceipt;

       return (
            <div>
                <Receipt receipt={this.state.receipt}
                  pickMeUp={this.pickMeUp}
                  updateReceipt={this.updateHandler}
                  serviceChargeBooleanHandler={this.serviceChargeBooleanHandler}
                  gstBooleanHandler={this.gstBooleanHandler}
                  />
            </div>
          );
      }
   }
}



ItemElement.propTypes = {
  id: PropTypes.integer,
  type: PropTypes.string,
  pickMeUp: PropTypes.func,
};

export default MainReceipt;