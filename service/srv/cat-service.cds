using my.db as my from '../db/data-model';

service CatalogService {
    entity Topics as projection on my.Topics;
    entity Tags as projection on my.Tags;
    entity Regions as projection on my.Regions;
    entity TopicsRegions as projection on my.TopicsRegions;
    entity TopicsTags as projection on my.TopicsTags;
    entity Customers as projection on my.Customers;
    entity ManualAddedErpIDs as projection on my.ManualAddedErpIDs;
    entity topicPublished as projection on my.Published;
    type downloadReturn {
        customerName: String;
        FbaStatus:String;
        erpId:Integer;
        UserId:String;
    };

function downloadCustomer(input:String) returns downloadReturn;


}