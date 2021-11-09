const { MessageEmbed } = require("discord.js");
const got = require("got");
const moment = require("moment");

const getCollection = async (slug) => {
  try {
    const response = await got.get(
      `https://api.opensea.io/collection/${slug}`,
      {
        responseType: "json",
      }
    );
    return response.body.collection;
  } catch (err) {
    throw new Error("Failed to get collection, please try again later!");
  }
};

module.exports = {
  // Command name
  name: "floor",
  // Command does its thing in here
  async execute(msg, args) {
    console.log(args);
    try {
      const slug = args[0];
      // Get the collection
      const collection = await getCollection(slug);

      msg.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(":newspaper: Collection Info")
            .addField("Collection", collection.name)
            .addField("Release", `${moment(collection.created_date).fromNow()}`)
            .addField("Listed Count", `${collection.stats.count}`)
            .addField("Owner Count", `${collection.stats.num_owners}`)
            .addField(
              "Floor Price",
              `${collection.stats.floor_price.toFixed(3)} Ξ`
            )
            .addField(
              "Volume 24H",
              `${collection.stats.one_day_volume.toFixed(3)} Ξ`
            )
            .addField(
              "Volume Total",
              `${collection.stats.total_volume.toFixed(3)} Ξ`
            )
            .addField(
              "Average Price 24H",
              `${collection.stats.one_day_average_price.toFixed(3)} Ξ`
            )
            .addField(
              "Average Price Total",
              `${collection.stats.average_price.toFixed(3)} Ξ`
            ),
        ],
      });
    } catch (err) {
      console.log(err);
      msg.channel.send(err.message);
    }
  },
};
