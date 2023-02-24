const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();
const text = require('./const');
const data = require('./data');
const bot = new Telegraf(process.env.BOT_TOKEN);

const getQuoteForToday = () => {
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  let indexQuote;
  if(dayOfYear > data.quotes.length) {
    const index = dayOfYear - data.quotes.length - 1;
    indexQuote = data.quotes[index];
  } else {
    indexQuote = data.quotes[dayOfYear - 1];
  }
  const quote = data.quotes[indexQuote];
  return quote;
}

const showQuote = (ctx, quoteObj) => {
  if (quoteObj.author) {
    return ctx.replyWithHTML(`<b>"${quoteObj.quote}" - ${quoteObj.author}</b>`);
  }
  return ctx.replyWithHTML(`<b>"${quoteObj.quote}"</b>`);
}

const getRandomNumberQuote = () => {
  return Math.floor(Math.random() * data.quotes.length);
}

bot.start(async (ctx) => {
  try {
    await ctx.reply(`Hello, ${ctx.message.from.first_name ? ctx.message.from.first_name : 'stranger'}!`);

    await setInterval(() => {
      const quoteObj = getQuoteForToday();
      showQuote(ctx, quoteObj);
    }, 10000)
    // 86400000
  } catch (error) {
      console.error(error);
  }
});

bot.help((ctx) => {
  try {
    ctx.reply(text.commands);
  } catch (error) {
      console.error(error);
  }
});

bot.command('showAllQuotes', (ctx) => {
  try {
    data.quotes.forEach((quoteObj) => {
      showQuote(ctx, quoteObj);
    });
  } catch (error) {
      console.error(error);
  }
})

bot.command('quoteForToday', (ctx) => {
  try {
    const quoteObj = getQuoteForToday();
    showQuote(ctx, quoteObj);
  } catch (error) {
    console.error(error);
  }
})

bot.command('showRandomQuote', (ctx) => {
  try {
    const num = getRandomNumberQuote();
    const quoteObj = data.quotes[num];
    showQuote(ctx, quoteObj);
  } catch (error) {
    console.error(error);
  }
})

bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears(['hi', 'Hey', 'hey', 'Hi', 'Hello', 'hello', 'What is up?'], (ctx) => ctx.reply('Hey there'));
bot.catch(console.error);
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));