const os = require('os');
const _ = require('lodash');

function platformNIC() {
  const interfaces = os.networkInterfaces();
  switch (process.platform) {
    case 'darwin':
      return interfaces.lo0;
    case 'linux':
      if (interfaces.ens192) return interfaces.ens192;
      if (interfaces.eno16780032) return interfaces.eno16780032;
      return interfaces.lo;
    default: // win32
      return interfaces.Ethernet0 ? interfaces.Ethernet0 : interfaces['Wi-Fi'];
  }
}


module.exports.getIpAdress = () => {
  const nic = platformNIC();
  const ipv4 = _.find(nic, function(item){
    return item.family === 'IPv4';
  });
  return ipv4.address;
};
