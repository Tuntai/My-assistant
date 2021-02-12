from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.shortcuts import render,redirect
from .forms import HomeForm
import requests
from urllib.request import urlopen
from lxml import etree
import threading, time
from threading import Thread

user_req = ""
me = {}

class MyThread(Thread):
    def __init__(self, tstep, hfunc, args=None):
        Thread.__init__(self)
        self.hfunc = hfunc
        self.tstep = tstep
        self.args = args

    def run(self):
        while True:
            print(" I am the boss ")
            time.sleep(self.tstep)
            self.hfunc()
            # threading.Timer(self.tstep, self.hfunc, self.args).start()

def index(request):
    mail_info = {}

    mail_info = read_email_from_gmail()

    # print(mail_info)

    name = []
    msg = []

    for sender, subject in mail_info.items():
        name.append(sender)
        msg.append(subject)

    print(name, msg)

    fin_news = {}

    fin_news  = news()

    print(fin_news)

    
    return render(request, 'dashboard/main.html', {'mail_info': mail_info, 'fin_news': fin_news})
    # else:
    #     return HttpResponse('/thanks/')
#    return HttpResponse('hello')

def track_value():
    print("im being called")
    global me

    def notify():
        print("different")

    def notnotify():
        print("not different")


    for link in me:
        data = urlopen(link)
        htmlparser = etree.HTMLParser()
        tree = etree.parse(data, htmlparser)

        for xpath in me[link]:
            old_data = me[link][xpath]
            new_data = tree.xpath(xpath+ '/text()')

            if old_data != new_data:
                me[link][xpath] = new_data
                notify()

            else:
                notnotify()

def track_triggering():
    MyThread(10, track_value).start()

def output(request):
    global user_req
    data=user_req
    print(data)

    return render(request, 'try.html', {'data': data})


import smtplib
import time
import imaplib
import email
import traceback 
# -------------------------------------------------
#
# Utility to read email from Gmail Using Python
#
# ------------------------------------------------
ORG_EMAIL = "@gmail.com" 
FROM_EMAIL = "teastmaildjapp@gmail.com" #+ ORG_EMAIL 
FROM_PWD = "Testpass123" 
SMTP_SERVER = "imap.gmail.com" 
SMTP_PORT = 993

def read_email_from_gmail():
    try:
        mail = imaplib.IMAP4_SSL(SMTP_SERVER)
        mail.login(FROM_EMAIL,FROM_PWD)
        mail.select('Inbox')

        data = mail.search(None, 'ALL')
        mail_ids = data[1]
        id_list = mail_ids[0].split()   
        first_email_id = int(id_list[0])
        latest_email_id = int(id_list[-1])

        count = 0
        fin = {}
        for i in range(latest_email_id,first_email_id, -1):
            count += 1
            # if(count == 8):
            #     break;
            data = mail.fetch(str(i), '(RFC822)' )
            for response_part in data:
                arr = response_part[0]
                if isinstance(arr, tuple):
                    msg = email.message_from_string(str(arr[1],'utf-8'))
                    email_subject = msg['subject']

                    # text = ''.join((c for c in str(email_subject) if ord(c) < 128))

                    # email_subject = text

                    email_from = msg['from']
                    email_body = msg['body']
                    
                    fin[email_from] = email_subject
        print(fin)
        return fin

                    # print('From : ' + email_from + '\n')
                    # print('Subject : ' + email_subject + '\n')

    except Exception as e:
        traceback.print_exc() 
        print(str(e))



import pprint 
import json
import requests 


def news():
      
    secret = "6d1a6117f1d24ecaaa2f054c7e8b58a6"
       
    # Define the endpoint 
    url = 'https://newsapi.org/v2/everything?'
       
    # Specify the query and 
    # number of returns 
    parameters = { 
        'q': 'merkel', # query phrase 
        'pageSize': 100,  # maximum is 100 
        'apiKey': secret # your own API key 
    } 
       
    # Make the request 
    response = requests.get(url,  
                            params = parameters) 
       
    # Convert the response to  
    # JSON format and pretty print it 
    response_json = response.json() 
    # pprint.pprint(response_json) 
    # with open('news1.json', 'w') as f:
    news_data = {}

    news_data = response_json
    # json.dump(response_json, news_data, ensure_ascii=False, indent=4)

    # nlist = []
    # slist = []

    fin_data = {}
    count = 0

    for things in news_data["articles"]:
        place = (things["source"]["name"])
        thenews = (things["title"])
        count += 1

        fin_data[place] = thenews

        if count == 10 :
            break

    print(fin_data)
    # print(len(nlist), len(slist))

    return fin_data