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

let code_store = [{ spcode: '771057',
spentityid:
 'http://sp3.sust.com/simplesaml/module.php/saml/sp/metadata.php/default-sp',
idpentityid: 'http://idp.sust.com/simplesaml/saml2/idp/metadata.php',
dynamicfed: 'dynamicfed',
author: 'sp',
spcheck: 'pending',
idpcheck: 'pending',
idpcode: '380740' }];

app.post('/storecode', (req, res) => {
        console.log('POST postcode : ', req.body);

        let spentityid = req.body.spentityid;
        let idpentityid = req.body.idpentityid;
        
        let result = code_store.find(item => {
                if(item.spentityid == spentityid && item.idpentityid == idpentityid){
                        console.log('updating entry');
                        
                        item. spentityid = req.body.spentityid;
                        item. idpentityid = req.body.idpentityid;
                        
                        item. spcheck = req.body.spcheck;
                        item. idpcheck = req.body.idpcheck;
                        
                        if(req.body.author == 'sp'){
                                item. spcode = req.body.spcode;
                        }
                        else if(req.body.author == 'idp'){
                                item. idpcode = req.body.idpcode;
                        }
                        
                        return item;
                }
        });
        if(result == undefined) {
                console.log('new entry');
                code_store.push(req.body);
        }
        
        res.send('success');
});

app.get('/codefetch', (req, res) => {
	
	let spentityid = req.query.spentityid;
        let idpentityid = req.query.idpentityid;
        let code = req.query.code;
        let author = req.query.author;

        let result = code_store.find(item => {
                if(item.spentityid == spentityid && item.idpentityid == idpentityid){
                        console.log('code check: ',  author);
                        console.log(item);
                        
                        if(item.author == 'sp' && item.spcode == code){
                                res.send('sp-success');
                        }
                        else if(item.author == 'idp' && item.idpcode == code){
                                res.send('idp-success');
                        }
                }
        });
        
        res.send('code-failed');
});

app.get('/approval', (req, res) => {
	
	let author = req.query.author;

        let result = []; 
        code_store.find(item => {
                if(item.spentityid == author || item.idpentityid == author){
                        result.push(item);
                }
        });
	console.log('GET approval : ', result);
        
        res.send(result);
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
