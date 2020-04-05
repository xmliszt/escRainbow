import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time


class fronendTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()

    # enter username and password

    def test_username_password1(self):
        driver = self.driver
        driver.get("https://alpha-holding.herokuapp.com/")

        # get icon for chat
        chat_icon = driver.find_element_by_class_name("toggle-chat-btn")
        chat_icon.click()
        time.sleep(3)

        card_replacement = driver.find_element_by_xpath(
            '//*[@id="1"]')
        card_replacement.click()
        time.sleep(3)

        yes_please = driver.find_element_by_xpath(
            '//*[@id="cd-0"]')
        yes_please.click()
        time.sleep(3)

        sign_in = driver.find_element_by_xpath(
            '//*[@id="resignin-5"]')
        sign_in.click()
        time.sleep(3)

        # enter username and password
        username = driver.find_element_by_id("usernameInput")
        password = driver.find_element_by_id("passwordInput")
        time.sleep(3)

        username.send_keys("test1")
        password.send_keys("test1")
        time.sleep(3)

        driver.find_element_by_id("login_btn").click()
        time.sleep(3)

    # enter username and password
    def test_username_password2(self):
        driver = self.driver
        driver.get("https://alpha-holding.herokuapp.com/")

        # get icon for chat
        chat_icon = driver.find_element_by_class_name("toggle-chat-btn")
        chat_icon.click()
        time.sleep(3)

        card_replacement = driver.find_element_by_xpath(
            '//*[@id="1"]')
        card_replacement.click()
        time.sleep(3)

        yes_please = driver.find_element_by_xpath(
            '//*[@id="cd-0"]')
        yes_please.click()
        time.sleep(3)

        sign_in = driver.find_element_by_xpath(
            '//*[@id="resignin-5"]')
        sign_in.click()
        time.sleep(3)

        # enter username and password
        username = driver.find_element_by_id("usernameInput")
        password = driver.find_element_by_id("passwordInput")
        time.sleep(3)

        username.send_keys("")
        password.send_keys("")
        time.sleep(3)

        driver.find_element_by_id("login_btn").click()
        time.sleep(3)

    # enter username and password
    def test_username_password3(self):
        driver = self.driver
        driver.get("https://alpha-holding.herokuapp.com/")

        # get icon for chat
        chat_icon = driver.find_element_by_class_name("toggle-chat-btn")
        chat_icon.click()
        time.sleep(3)

        card_replacement = driver.find_element_by_xpath(
            '//*[@id="1"]')
        card_replacement.click()
        time.sleep(3)

        yes_please = driver.find_element_by_xpath(
            '//*[@id="cd-0"]')
        yes_please.click()
        time.sleep(3)

        sign_in = driver.find_element_by_xpath(
            '//*[@id="resignin-5"]')
        sign_in.click()
        time.sleep(3)

        # enter username and password
        username = driver.find_element_by_id("usernameInput")
        password = driver.find_element_by_id("passwordInput")
        time.sleep(3)

        username.send_keys("%ssomething")
        password.send_keys("%d1334")
        time.sleep(3)

        driver.find_element_by_id("login_btn").click()
        time.sleep(3)

    def tearDown(self):
        self.driver.close()


if __name__ == "__main__":
    unittest.main()
