import { LightningElement, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from   'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import Account from '@salesforce/schema/Account';
import Name from '@salesforce/schema/Account.Name';
import Phone from '@salesforce/schema/Account.Phone';

export default class NewAccountUiRecordApi extends NavigationMixin (LightningElement) {

    account = {
        Name: "",
        Phone: ""
    };

    handleInputChange(event){
        console.log(event);
        console.log(event.target);
        let name_ = event.target.name;
        let value_ = event.target.value;

        this.account = {...this.account, [name_]:value_};
        console.log(this.account);
    }

    createAccount(){

        const fields = {};
        console.log('obj fields vazio');
        console.log(fields);

        fields[Name.fieldApiName] = this.account.Name;
        fields[Phone.fieldApiName] = this.account.Phone;

        console.log('obj fields montado');
        console.log(fields);

        const recordInput = {apiName: Account.objectApiName, fields};

        console.log('recordInput Montado');
        console.log(recordInput);

        createRecord(recordInput).then(
            (event)=>{

                const confirm = new ShowToastEvent({
                    title:'Conta criada',
                    message: 'ID da Conta: ' + event.id,
                    variant: 'success'
                });

                this.dispatchEvent(confirm);
                       
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: event.id,
                        objectApiName: 'Account',
                        actionName: 'view'
                    }
                });

            }
            
        ).catch(
            (error)=>{
                const erro = new ShowToastEvent({
                    title:'Erro',
                    message: error.body.message, 
                    variant: 'error'
                });

                this.dispatchEvent(erro);
            }
        )
    }
}