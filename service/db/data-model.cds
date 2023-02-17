namespace my.db;
using { cuid } from '@sap/cds/common';

type Status : String enum {
  finished; accepted; draft; discontinued;
}
entity Topics {
  key ID : UUID;
  name  : String;
  status : Status;
  aquicition: Boolean;
  tags: Association to many  TopicsTags on tags.Topics_ID = ID;
  regions: Association to many  TopicsRegions on regions.Topics_ID= ID;
  topicPublished: Association to Published  on topicPublished.Topics_ID= ID;
  customers: Association to many Customers on customers.Topics_ID=ID;
  manualAddedErpIDs: Association to many ManualAddedErpIDs on manualAddedErpIDs.Topics_ID=ID;

}


entity Tags{
key ID :UUID;
name: String;
}


entity Regions{
key ID :UUID;
name: String;
}

type FbaStatus: String enum{
Signed;![Not Signed]
}
entity Fba{
  key erpId: Integer;
  status: FbaStatus;
}

entity Customers {
  key ID : UUID;
  name : String(255);
  customerId: String(10);
  erpId: Integer; 
  Topics_ID : String;
  fbaStatus: Association to one Fba on fbaStatus.erpId=erpId;
}

entity ManualAddedErpIDs {
  key ID : UUID;
  customerId: String;
  erpId: Integer;
  manualErpId: Integer; 
  Topics_ID : String;
  fbaStatus: Association to one Fba on fbaStatus.erpId=manualErpId;
}

entity Published:cuid { 
 paylod: String(5000);
 Topics_ID: String;
}
/*
payload={ 
  "name":"xyz",
  "tags":[{"TAG_ID"="234"},{"TAG_ID"="234"}]
}
*/

entity TopicsTags:cuid{
  Topics_ID: String;
  Tags_ID: String;
}

entity TopicsRegions:cuid{
  Topics_ID: String;
  Regions_ID:String;
}

