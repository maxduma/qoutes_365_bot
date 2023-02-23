const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();
const text = require('./const');
const data = require('./data');
const bot = new Telegraf(process.env.BOT_TOKEN);


const getQuoteForToday = () => {
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const quote = data.quotes[2];
  return quote;
}

const formAQuote = (ctx, quoteObj) => {
  return ctx.replyWithHTML(`<b>"${quoteObj.quote}" - ${quoteObj.author}</b>`)
}

bot.start(async (ctx) => {
  try {
    await ctx.reply(`Hello, ${ctx.message.from.first_name ? ctx.message.from.first_name : 'stranger'}!`)

    await setInterval(() => {
      const quoteObj = getQuoteForToday()
      formAQuote(ctx, quoteObj);
    }, 4000)
    // 86400000
  } catch (error) {
      console.error(error)
  }
});

bot.help((ctx) => {
  try {
    ctx.reply(text.commands)
  } catch (error) {
      console.error(error)
  }
});

bot.command('showAllQuotes', (ctx) => {
  try {
    data.quotes.forEach((quoteObj) => {
      formAQuote(ctx, quoteObj)
    });
  } catch (error) {
      console.error(error);
  }
})

bot.command('quoteForToday', (ctx) => {
  try {
    const quoteObj = getQuoteForToday()
    formAQuote(ctx, quoteObj);
  } catch (error) {
    console.error(error)
  }
})

bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears(['hi', 'Hey', 'hey', 'Hi', 'Hello', 'hello', 'What is up?'], (ctx) => ctx.reply('Hey there'));
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));