App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  isBought: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Product.json", function(product) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Product = TruffleContract(product);
      // Connect provider to interact with contract
      App.contracts.Product.setProvider(App.web3Provider);

      //App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Product.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.buyEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new buy is recorded
        App.render();
      });
    });
  },

  render: function() {
    var productInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.Product.deployed().then(function(instance) {
      productInstance = instance;
      return productInstance.productCount();
    }).then(function(productCount) {
      var productResults = $("#productResults");
      productResults.empty();
console.log(productResults);
      var productSelect = $('#productSelect');
      productSelect.empty();

      for (var i = 1; i <= productCount; i++) {
        productInstance.products(i).then(function(product) {
          var id = product[0];
          var name = product[1];
          var qrCode = product[2];
          var saleStatus = product[3];

          // Render product Result
          var productTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + saleStatus + "</td></tr>"
          productResults.append(productTemplate);

          // Render product buy option
          var productOption = "<option value='" + id + "' >" + name + "</ option>"
          productSelect.append(productOption);
        });
      }
      loader.hide();
      content.show();
    //  return productInstance.voters(App.account);
  });
},

  buyProduct: function() {
    var productId = $('#productSelect').val();
    App.contracts.Product.deployed().then(function(instance) {
      return instance.buy(productId, { from: App.account });
    }).then(function(result) {
      // Wait for products to update
      $("#content").hide();
      $("#loader").show();
      App.init();
    }).catch(function(err) {
      console.error(err);
    });
  },

  checkPoduct: function() {
    var productCode = $('#productCode').val();
    var hash = web3.sha3(productCode);
    App.contracts.Product.deployed().then(function(instance) {
      return instance.checkProduct.call(hash, { from: App.account });
    }).then(function(result) {
      // Wait for products to update
      if(result ==""){
        $("#result").text("Product not found");
      }else{
        $("#result").text(result);
      }
      
      console.log(result)
      $("#content").hide();
      $("#loader").show();
      App.init();
    }).catch(function(err) {
      console.error(err);
    });
  }


  
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
