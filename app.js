const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

let mailmeta = {
  entityid: "https://mail.service.com/service/extension/samlreceiver ",
  contacts: [],
  "metadata-set": "saml20-sp-remote",
  AssertionConsumerService: [
    {
      Binding: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST",
      Location: "https://mail.service.com/service/extension/samlreceiver",
      index: 0,
    },
  ],
  SingleLogoutService: [],
  "validate.authnrequest": false, 
  "NameIDFormat": "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
  "simplesaml.nameidattribute": "uid",
};

let trusted_list_idp = [
  "http://sp1.sust.com/simplesaml/module.php/saml/sp/metadata.php/default-sp",
  "http://sp2.sust.com/simplesaml/module.php/saml/sp/metadata.php/default-sp",
  "http://code.sust.com/simplesaml/module.php/saml/sp/metadata.php/default-sp",
  "http://3.131.152.59:3000/mailmetadata",
];
let trusted_list_code = [
  "http://idp.sust.com/simplesaml/saml2/idp/metadata.php",
];
let trusted_list_sp1 = [
  "http://idp.sust.com/simplesaml/saml2/idp/metadata.php",
];
let trusted_list_sp2 = [
  "http://idp.sust.com/simplesaml/saml2/idp/metadata.php",
];
let trusted_list_sp3 = [];

let code_store = [];

app.post('/storecode', (req, res) => {
	let spentityid = req.body.spentityid;
        let idpentityid = req.body.idpentityid;
        let idpcode = req.body.idpcode;
        let spcode = req.body.spcode;
        
        let result = code_store.find(item => {
                if(item.spentityid == spentityid){
                        console.log('updating entry');
                        
                        item. spentityid = req.body.spentityid;
                        item. idpentityid = req.body.idpentityid;
                        item. idpcode = req.body.idpcode;
                        item. spcode = req.body.spcode;
                        item. spcheck = req.body.spcheck;
                        item. idpcheck = req.body.idpcheck;
                }
                return item;
        });
        if(!result) {
                console.log('new entry');
                code_store.push(req.body);
        }
        console.log('POST postcode : ', code_store);
        res.send('success');
});

app.get('/codefetch', (req, res) => {
	
	let spentityid = req.query.spentityid;
        let idpentityid = req.query.idpentityid;

	let result = code_store.find(item => item.spentityid == spentityid);
	console.log('GET getcode : ', result);
	res.send(result.code);
});

app.get('/tallistfetch', (req, res) => {
	let entityId = req.query.entityId;
	console.log('GET : ' + entityId);
	if(entityId === 'idp'){
		res.send(trusted_list_idp);
	} 
	else if(entityId === 'sp1'){
                res.send(trusted_list_sp1);
        } 
	else if(entityId === 'sp2'){
               res.send(trusted_list_sp2);
        } 
	else if(entityId === 'sp3'){
                res.send(trusted_list_sp3);
        } 
	else if(entityId === 'code'){
                res.send(trusted_list_code);
        }
	else if(entityId === 'mailmetadata'){
                res.send(mailmeta);
        }
	else {
		res.send(entityId + ': not recognized');
	}
});
app.post('/storetallist', (req, res) => {
    	
	let entityId = req.body.entityId;
        let tal = req.body.tal;

    	console.log('POST : ', entityId, body);	

	if(entityId === 'sp1'){
		trusted_list_sp1.push(tal);
	} 
	else if(entityId === 'sp2'){
                trusted_list_sp2.push(tal);
        } 
	else if(entityId === 'sp3'){
                trusted_list_sp3.push(tal);
        }
	else if(entityId === 'idp'){
                trusted_list_idp.push(tal);       
	}
      	res.send('success');
});

app.get('/mailmetadata', (req, res) => {
	res.send(mailmeta);
})

app.listen(3000, () => console.log('Gator app listening on port 3000!'));
